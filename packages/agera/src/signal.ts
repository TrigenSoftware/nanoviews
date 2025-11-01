
import {
  type ComputedSignalInstance,
  type SignalInstance,
  type AnySignal,
  type ReadableSignal,
  type WritableSignal,
  type Compute,
  type Morph,
  type Mountable,
  type NewValue,
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
  $$mounted,
  $$signal,
  $$subsCount,
  ComputedSubscriberFlag,
  DirtySubscriberFlag,
  PendingComputedSubscriberFlag,
  EffectScopeSubscriberFlag,
  WritableSignalFlag,
  link,
  processComputedUpdate,
  propagate,
  processEffectNotifications,
  activeSub,
  skipMount,
  untracked
} from './internals/index.js'
import { effect } from './effect.js'
import { isFunction } from './utils.js'

/**
 * Listen for mount and unmount events on a mountable signal.
 * @param $signal - The signal to subscribe to.
 * @param listener - The listener to call when the signal is mounted or not.
 * @returns A function to stop the subscription.
 */
export function onMounted(
  $signal: Mountable<AnySignal>,
  listener: (mounted: boolean) => void
) {
  const instance = $signal[$$signal]
  const $mounted = (instance[$$mounted] ||= signal(false)) as ReadableSignal<boolean>

  return effect((warmup) => {
    const mounted = $mounted()

    if (!warmup) {
      untracked(() => skipMount(instance, () => listener(mounted)))
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
  instance: SignalInstance | ComputedSignalInstance,
  ctx: SignalInstance | ComputedSignalInstance | Morph = instance
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
    [$$flags]: WritableSignalFlag,
    [$$subsCount]: 0
  }) as WritableSignal<T | undefined>
}

function signalGetterSetter<T>(this: SignalInstance<T>, ...value: [NewValue<T>]): T | void {
  if (value.length) {
    const newValue = value[0]
    const prevValue = this[$$value]

    if (prevValue !== (this[$$value] = isFunction(newValue) ? newValue(prevValue) : newValue)) {
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
    [$$compute]: compute as Compute<unknown>,
    [$$value]: undefined,
    [$$subs]: undefined,
    [$$subsTail]: undefined,
    [$$deps]: undefined,
    [$$depsTail]: undefined,
    [$$flags]: ComputedSubscriberFlag | DirtySubscriberFlag,
    [$$subsCount]: 0
  }) as ReadableSignal<T>
}

function computedGetter<T>(this: ComputedSignalInstance<T>): T {
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
