import {
  START,
  STOP,
  CHANGE,
  on,
  dispatch
} from './events/index.js'
import type {
  Store,
  AnyObject,
  EmptyObject
} from './types/index.js'
import { LevelSymbol } from './types/index.js'

/**
 * Listen to store changes.
 * @param $store - The store to listen to.
 * @param listener - The listener function.
 * @param level - The priority level of the listener.
 * @returns Function to stop listening.
 */
export function listen<T, S extends AnyObject = EmptyObject>(
  $store: Store<T>,
  listener: (value: T, prevValue: T, shared: S) => void,
  level?: number
) {
  const off = on(
    $store,
    CHANGE,
    (value, prevValue, _abort, shared) => listener(value, prevValue, shared),
    level || $store[LevelSymbol],
    () => dispatch($store, START)
  )

  return () => {
    if (off()) {
      dispatch($store, STOP)
    }
  }
}

function pickSharedArg<S extends AnyObject = EmptyObject>(listener: (shared: S) => void) {
  return (_abort: unknown, shared: S) => listener(shared)
}

/**
 * Listen to store start.
 * @param $store - The store to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onStart<T, S extends AnyObject = EmptyObject>(
  $store: Store<T>,
  listener: (shared: S) => void
) {
  return on($store, START, pickSharedArg(listener))
}

/**
 * Listen to store stop.
 * @param $store - The store to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onStop<T, S extends AnyObject = EmptyObject>(
  $store: Store<T>,
  listener: (shared: S) => void
) {
  return on($store, STOP, pickSharedArg(listener))
}

export const STORE_UNMOUNT_DELAY = 1000

/**
 * Listen to store mount and unmount.
 * @param $store - The store to listen to.
 * @param listener - The mount listener function that returns an unmount listener.
 * @returns Function to stop listening.
 */
export function onMount<T, S extends AnyObject = EmptyObject>(
  $store: Store<T>,
  listener: (shared: S) => (() => void) | void
) {
  let timerId: ReturnType<typeof setTimeout> | undefined
  let destroy: (() => void) | void
  const offStart = onStart($store, (shared: S) => {
    clearTimeout(timerId)
    destroy = listener(shared)
  })
  const offStop = onStop($store, () => {
    if (destroy) {
      timerId = setTimeout(destroy, STORE_UNMOUNT_DELAY)
    }
  })

  return () => {
    offStart()
    offStop()
  }
}
