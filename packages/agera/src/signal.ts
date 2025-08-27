
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
  $$signal,
  $$writable,
  $$effects,
  ComputedSubscriberFlag,
  DirtySubscriberFlag,
  PendingComputedSubscriberFlag,
  EffectScopeSubscriberFlag,
  link,
  processComputedUpdate,
  propagate,
  processEffectNotifications,
  activeSub
} from './internals/index.js'
import { effect } from './effect.js'

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
  const $active = ($signal[$$signal][$$onActivate] ||= signal(false)) as ReadableSignal<boolean>

  return effect((warmup) => {
    const active = $active()

    if (!warmup) {
      listener(active)
    }
  }, true)
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

function createSignal(
  constructor: (value?: unknown) => unknown,
  instance: Signal | ComputedSignal,
  ctx: Signal | ComputedSignal | Morph = instance
) {
  const $signal = constructor.bind(ctx) as AnySignal

  $signal[$$signal] = instance

  return $signal
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

/* @__NO_SIDE_EFFECTS__ */
export function signal<T>(value?: T): WritableSignal<T | undefined> {
  return createSignal(signalGetterSetter, {
    [$$value]: value,
    [$$subs]: undefined,
    [$$subsTail]: undefined,
    [$$effects]: 0,
    [$$writable]: true
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
    if (activeSub !== undefined && !(activeSub[$$flags] & EffectScopeSubscriberFlag)) {
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
/* @__NO_SIDE_EFFECTS__ */
export function computed<T>(compute: Compute<T>): ReadableSignal<T> {
  return createSignal(computedGetter, {
    [$$value]: undefined,
    [$$subs]: undefined,
    [$$subsTail]: undefined,
    [$$deps]: undefined,
    [$$depsTail]: undefined,
    [$$effects]: 0,
    [$$flags]: ComputedSubscriberFlag | DirtySubscriberFlag,
    [$$compute]: compute as Compute<unknown>
  }) as ReadableSignal<T>
}

function computedGetter<T>(this: ComputedSignal<T>): T {
  const flags = this[$$flags]

  if (flags & (DirtySubscriberFlag | PendingComputedSubscriberFlag)) {
    processComputedUpdate(this, flags)
  }

  if (activeSub !== undefined && !(activeSub[$$flags] & EffectScopeSubscriberFlag)) {
    link(this, activeSub)
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

/* @__NO_SIDE_EFFECTS__ */
export function morph<T, C extends Partial<Morph<T>>>(
  $signal: ReadableSignal<T> | WritableSignal<T>,
  context: C
) {
  return createSignal(morphGetterSetter, $signal[$$signal], {
    [$$source]: $signal,
    [$$set]: $signal,
    [$$get]: $signal,
    ...context
  } as Morph)
}

function morphGetterSetter<T>(this: Morph<T>, ...value: [T]): T | void {
  if (value.length) {
    this[$$set](value[0])
  } else {
    return this[$$get]()
  }
}
