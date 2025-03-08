
import {
  type ComputedSignal,
  type Signal,
  type AnySignal,
  type ReadableSignal,
  type WritableSignal,
  type Compute,
  type Morph,
  $$subs,
  $$subsTail,
  $$flags,
  $$deps,
  $$depsTail,
  $$compute,
  $$value,
  $$source,
  $$get,
  $$set,
  $$onActivate,
  ComputedSubscriberFlag,
  DirtySubscriberFlag,
  PendingComputedSubscriberFlag,
  link,
  processComputedUpdate,
  propagate,
  processEffectNotifications,
  activeSub,
  activeScope
} from './internals/index.js'
import { effect } from './effect.js'

let captureInstance = false

/**
 * Subscribe to signal activation.
 * @param $signal - The signal to subscribe to.
 * @param listener - The listener to call when the signal is activated or deactivated.
 * @returns A function to stop the subscription.
 */
export function onActivate(
  $signal: AnySignal,
  listener: (active: boolean) => void
) {
  captureInstance = true

  const inst = $signal() as Signal

  captureInstance = false

  const $active = (inst[$$onActivate] ||= signal(false)) as ReadableSignal<boolean>

  return effect((warmup) => {
    const active = $active()

    if (!warmup) {
      listener(active)
    }
  })
}

let batchDepth = 0

/**
 * Start a batch of signal updates.
 */
export function startBatch() {
  ++batchDepth
}

/**
 * End a batch of signal updates.
 */
export function endBatch() {
  if (!--batchDepth) {
    processEffectNotifications()
  }
}

/**
 * Create a signal with atomic value.
 * @returns A signal.
 */
export function signal<T>(): WritableSignal<T | undefined>
/**
 * Create a signal with initial atomic value
 * @param value - Initial value of the signal.
 * @returns A signal.
 */
export function signal<T>(value: T): WritableSignal<T>

export function signal<T>(value?: T): WritableSignal<T | undefined> {
  return signalGetterSetter.bind({
    [$$value]: value,
    [$$subs]: undefined,
    [$$subsTail]: undefined
  }) as WritableSignal<T | undefined>
}

function signalGetterSetter<T>(this: Signal<T>, ...value: [T]): T | void {
  if (value.length) {
    if (this[$$value] !== (this[$$value] = value[0])) {
      const subs = this[$$subs]

      if (subs !== undefined) {
        propagate(subs)

        if (!batchDepth) {
          processEffectNotifications()
        }
      }
    }
  } else {
    if (captureInstance) {
      return this as T
    }

    if (activeSub !== undefined) {
      link(this, activeSub)
    }

    return this[$$value]
  }
}

/**
 * Create a signal that reactivly computes its value from other signals.
 * @param compute - The function to compute the value.
 * @returns A signal.
 */
export function computed<T>(compute: Compute<T>): ReadableSignal<T> {
  return computedGetter.bind({
    [$$value]: undefined,
    [$$subs]: undefined,
    [$$subsTail]: undefined,
    [$$deps]: undefined,
    [$$depsTail]: undefined,
    [$$flags]: ComputedSubscriberFlag | DirtySubscriberFlag,
    [$$compute]: compute as Compute<unknown>
  }) as ReadableSignal<T>
}

function computedGetter<T>(this: ComputedSignal<T>): T {
  if (captureInstance) {
    return this as T
  }

  const flags = this[$$flags]

  if (flags & (DirtySubscriberFlag | PendingComputedSubscriberFlag)) {
    processComputedUpdate(this, flags)
  }

  if (activeSub !== undefined) {
    link(this, activeSub)
  } else if (activeScope !== undefined) {
    link(this, activeScope)
  }

  return this[$$value]
}

export function morph<T, C extends Partial<Morph<T>>>(
  $signal: WritableSignal<T>,
  context: C
): WritableSignal<T>

export function morph<T, C extends Partial<Morph<T>>>(
  $signal: ReadableSignal<T>,
  context: C
): ReadableSignal<T>

export function morph<T, C extends Partial<Morph<T>>>(
  $signal: WritableSignal<T>,
  context: C
) {
  const ctx = {
    [$$source]: $signal,
    [$$set]: $signal,
    [$$get]: $signal,
    ...context
  }

  return morphGetterSetter.bind(ctx as Morph) as WritableSignal<T>
}

function morphGetterSetter<T>(this: Morph<T>, ...value: [T]): T | void {
  if (value.length) {
    this[$$set](value[0])
  } else {
    if (captureInstance) {
      return this[$$source]()
    }

    return this[$$get]()
  }
}
