import type {
  ReadableSignal,
  WritableSignal,
  AnySignal,
  AnyObject,
  AnyFn,
  EmptyObject,
  EventTarget
} from './types/index.js'
import {
  addListener,
  removeListener,
  dispatchLifecycle,
  dispatchAbortableLifecycle
} from './emitter.js'
import {
  $$START,
  $$STOP,
  $$SET,
  $$NOTIFY,
  $$CHANGE,
  $$listen,
  $$addListener,
  $$removeListener,
  $$notify
} from './symbols.js'
import { noop } from './utils.js'

/**
 * Listen to store changes.
 * @param $signal - The store to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function listen<T>(
  $signal: ReadableSignal<T>,
  listener: (value: T, prevValue: T) => void
) {
  return $signal[$$listen](listener)
}

/**
 * Subscribe to store changes. It's like `listen` but also calls the listener immediately.
 * @param $signal - The store to subscribe to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function subscribe<T>(
  $signal: ReadableSignal<T>,
  listener: (value: T, prevValue: T | undefined) => void
) {
  listener($signal.get(), undefined)

  return listen($signal, listener)
}

/**
 * Run listener immediately and return a function to subscribe to store changes.
 * @param $signal - The store to subscribe to.
 * @param listener - The listener function.
 * @returns Function to subscribe to store changes.
 */
export function subscribeLater<T>(
  $signal: ReadableSignal<T>,
  listener: (value: T, prevValue: T | undefined) => void
) {
  const firstValue = $signal.get()

  listener(firstValue, undefined)

  return () => {
    const value = $signal.get()

    if (firstValue !== value) {
      listener(value, firstValue)
    }

    return listen($signal, listener)
  }
}

function onSignalLifecycle(
  $signal: AnySignal,
  property: PropertyKey,
  createDispatcher: (fn: AnyFn) => AnyFn,
  event: symbol,
  listener: AnyFn
) {
  if (!Object.hasOwn($signal, property)) {
    ($signal as any)[property] = createDispatcher(
      (($signal as any)[property] as AnyFn).bind($signal)
    )
  }

  const listeners = addListener($signal, event, listener)

  return () => {
    if (removeListener(listeners, listener)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete ($signal as any)[property]
    }
  }
}

/**
 * Listen to store start.
 * @param $signal - The store to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onStart<T, S extends AnyObject = EmptyObject>(
  $signal: ReadableSignal<T>,
  listener: (shared: S) => void
) {
  return onSignalLifecycle($signal, $$addListener, superAddListener => function (this: ReadableSignal<T>, listener) {
    const listeners = superAddListener(listener)

    if (listeners.length === 1) {
      dispatchLifecycle(this, $$START)
    }

    return listeners
  }, $$START, listener)
}

/**
 * Listen to store stop.
 * @param $signal - The store to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onStop<T, S extends AnyObject = EmptyObject>(
  $signal: ReadableSignal<T>,
  listener: (shared: S) => void
) {
  return onSignalLifecycle($signal, $$removeListener, superRemoveListener => function (this: ReadableSignal<T>, listeners, listener) {
    const shouldStop = superRemoveListener(listeners, listener)

    if (shouldStop) {
      dispatchLifecycle(this, $$STOP)
    }

    return shouldStop
  }, $$STOP, listener)
}

export const STORE_UNMOUNT_DELAY = 1000

/**
 * Listen to store mount and unmount.
 * @param $signal - The store to listen to.
 * @param listener - The mount listener function that returns an unmount listener.
 * @returns Function to stop listening.
 */
export function onMount<T, S extends AnyObject = EmptyObject>(
  $signal: ReadableSignal<T>,
  listener: (shared: S) => (() => void) | void
) {
  let active = false
  let destroy: (() => void) | void
  const offStart = onStart($signal, (shared: S) => {
    if (!active) {
      destroy = listener(shared)
      active = true
    }
  })
  const offStop = onStop($signal, () => setTimeout(() => {
    if (active) {
      destroy?.()
      active = false
    }
  }, STORE_UNMOUNT_DELAY))

  return () => {
    offStart()
    offStop()
  }
}

/**
 * Listen to store set. This event is triggered before the store value is changed.
 * @param $signal - The store to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onSet<T, S extends AnyObject = EmptyObject>(
  $signal: WritableSignal<T>,
  listener: (nextValue: T, value: T, abort: () => void, shared: S) => void
) {
  return onSignalLifecycle($signal, 'set', superSet => function (this: WritableSignal<T>, nextValue) {
    const value = this.get()

    if (value !== nextValue && dispatchAbortableLifecycle(this, $$SET, [nextValue, value])) {
      superSet(nextValue)
    }
  }, $$SET, listener)
}

/**
 * Listen to store notify. This event is triggered after the store value is changed and before the store change event.
 * @param $signal - The store to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onNotify<T, S extends AnyObject = EmptyObject>(
  $signal: WritableSignal<T>,
  listener: (value: T, prevValue: T, abort: () => void, shared: S) => void
) {
  return onSignalLifecycle($signal, $$notify, superNotify => function (this: WritableSignal<T>, value, prevValue) {
    if (dispatchAbortableLifecycle(this, $$NOTIFY, [value, prevValue])) {
      superNotify(value, prevValue)
    }
  }, $$NOTIFY, listener)
}

export { onNotify as onChange }

/**
 * Start the store and keep it alive.
 * @param $signal - The store to keep alive.
 * @returns Function to stop keeping the store alive.
 */
export function start($signal: AnySignal) {
  return listen($signal, noop)
}

/**
 * Force stop the stores.
 * @param $signals - The stores to stop.
 */
export function stop(...$signals: AnySignal[]) {
  for (let i = 0, len = $signals.length, $signal: EventTarget; i < len; i++) {
    $signal = $signals[i] as {}

    if ($signal[$$CHANGE]) {
      $signal[$$CHANGE].length = 0
    }

    dispatchLifecycle($signal, $$STOP)
  }
}

/**
 * Start and stop the store immediately if it's not started.
 * @param $signal - The store to execute.
 * @returns The store.
 */
export function exec<T extends AnySignal>($signal: T) {
  start($signal)()

  return $signal
}

