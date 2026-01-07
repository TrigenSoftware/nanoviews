
import {
  type Subscriber,
  type Effect,
  type EffectScope,
  type EffectCallback,
  type ObserverCallback,
  type Destroy,
  type Accessor,
  type ReadableSignal,
  EffectSubscriberFlag,
  EffectScopeSubscriberFlag,
  LazyEffectSubscriberFlag,
  link,
  runEffect,
  runEffectScope,
  runLazyEffects,
  startTracking,
  endTracking,
  maybeDestroyEffect,
  activeSub,
  notifyMounted,
  activeNoMount,
  isMountableUsed,
  untracked,
  noMount
} from './internals/index.js'

function effectStop(this: Subscriber | Effect): void {
  startTracking(this)
  maybeDestroyEffect(this)
  endTracking(this)
}

function lazyEffectsRun(this: EffectScope): Destroy {
  this.flags &= ~LazyEffectSubscriberFlag

  notifyMounted(activeSub)

  if (this.deps !== undefined) {
    runLazyEffects(this.deps)
  }

  return effectStop.bind(this)
}

/**
 * Run effect function and re-run it on dependency change.
 * @param fn - The effect function to run.
 * @param ignoreLazy - Whether to ignore lazyness inheritence.
 * @returns A function to stop the effect.
 */
export function effect(fn: EffectCallback, ignoreLazy = false): Destroy {
  const e: Effect = {
    effect: fn,
    subs: undefined,
    subsTail: undefined,
    deps: undefined,
    depsTail: undefined,
    flags: EffectSubscriberFlag,
    destroy: undefined
  }

  if (isMountableUsed && activeNoMount !== undefined) {
    e.noMount = activeNoMount
  }

  if (activeSub !== undefined) {
    link(e, activeSub)

    if (!ignoreLazy && activeSub.flags & LazyEffectSubscriberFlag) {
      e.flags |= LazyEffectSubscriberFlag
      return effectStop.bind(e)
    }
  }

  runEffect(e, true)

  return effectStop.bind(e)
}

function createEffectScopeInstance(): EffectScope {
  return {
    subs: undefined,
    subsTail: undefined,
    deps: undefined,
    depsTail: undefined,
    flags: EffectSubscriberFlag | EffectScopeSubscriberFlag
  }
}

function runEffectScopeInstance(
  e: EffectScope,
  fn: () => void,
  lazy = false
): Destroy | (() => Destroy) {
  if (!lazy && activeSub !== undefined) {
    link(e, activeSub)
  }

  if (lazy || activeSub !== undefined && activeSub.flags & LazyEffectSubscriberFlag) {
    e.flags |= LazyEffectSubscriberFlag
  }

  runEffectScope(e, fn)

  if (lazy) {
    return lazyEffectsRun.bind(e)
  }

  return effectStop.bind(e)
}

/**
 * Run effect scope function to group effects.
 * @param fn - The effect scope function to run.
 * @returns A function to stop child effects.
 */
export function effectScope(fn: () => void): Destroy

/**
 * Run effect scope function to group effects.
 * @param fn - The effect scope function to run.
 * @param lazy - Whether to run the effects lazily.
 * @returns A function to start child effects.
 */
export function effectScope(
  fn: () => void,
  lazy: true
): () => Destroy

/**
 * Run effect scope function to group effects.
 * @param fn - The effect scope function to run.
 * @param lazy - Whether to run the effects lazily.
 * @returns A function to stop child effects.
 */
export function effectScope(
  fn: () => void,
  lazy?: boolean
): Destroy | (() => Destroy)

export function effectScope(
  fn: () => void,
  lazy?: boolean
): Destroy | (() => Destroy) {
  return runEffectScopeInstance(createEffectScopeInstance(), fn, lazy)
}

/**
 * Create effect scope runner which will share the same scope instance.
 * @returns The effect scope runner.
 */
/* @__NO_SIDE_EFFECTS__ */
export function createEffectScope() {
  return runEffectScopeInstance.bind(null, createEffectScopeInstance()) as typeof effectScope
}

function singleEffect<T>(
  $accessor: Accessor<T>,
  fn: ObserverCallback<T>,
  skipWarmup: boolean,
  ignoreLazy?: boolean
) {
  return effect((warmup) => {
    const value = $accessor()

    if (!skipWarmup || !warmup) {
      untracked(() => fn(value))
    }
  }, ignoreLazy)
}

/**
 * Subscribe to accessor changes.
 * Callback will be called immediately.
 * Will trigger accessor mount if applicable.
 * @param $accessor - The accessor to subscribe to.
 * @param fn - The callback to call on value change.
 * @param ignoreLazy - Whether to ignore lazyness inheritence.
 * @returns A function to stop the subscription.
 */
export function subscribe<T>(
  $accessor: Accessor<T>,
  fn: ObserverCallback<T>,
  ignoreLazy?: boolean
) {
  return singleEffect($accessor, fn, false, ignoreLazy)
}

/**
 * Listen accessor changes.
 * Callback will be called only on value change, without initial call.
 * Will trigger accessor mount if applicable.
 * @param $accessor - The accessor to subscribe to.
 * @param fn - The callback to call on value change.
 * @param ignoreLazy - Whether to ignore lazyness inheritence.
 * @returns A function to stop the subscription.
 */
export function listen<T>(
  $accessor: Accessor<T>,
  fn: ObserverCallback<T>,
  ignoreLazy?: boolean
) {
  return singleEffect($accessor, fn, true, ignoreLazy)
}

/**
 * Observe accessor changes.
 * Callback will be called only on value change, without initial call.
 * Will not trigger accessor mount.
 * @param $accessor - The accessor to subscribe to.
 * @param fn - The callback to call on value change.
 * @param ignoreLazy - Whether to ignore lazyness inheritence.
 * @returns A function to stop the subscription.
 */
export function observe<T>(
  $accessor: ReadableSignal<T>,
  fn: ObserverCallback<T>,
  ignoreLazy?: boolean
) {
  return singleEffect(() => noMount($accessor), fn, true, ignoreLazy)
}

