
import {
  type Subscriber,
  type Effect,
  type EffectScope,
  type EffectCallback,
  type Destroy,
  $$subs,
  $$subsTail,
  $$flags,
  $$deps,
  $$depsTail,
  $$effect,
  $$destroy,
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
  notifyActivateListeners
} from './internals/index.js'

function effectStop(this: Subscriber | Effect): void {
  startTracking(this)
  maybeDestroyEffect(this)
  endTracking(this)
}

function lazyEffectsRun(this: EffectScope): Destroy {
  this[$$flags] &= ~LazyEffectSubscriberFlag

  notifyActivateListeners()

  if (this[$$deps] !== undefined) {
    runLazyEffects(this[$$deps])
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
    [$$effect]: fn,
    [$$subs]: undefined,
    [$$subsTail]: undefined,
    [$$deps]: undefined,
    [$$depsTail]: undefined,
    [$$flags]: EffectSubscriberFlag,
    [$$destroy]: undefined
  }

  if (activeSub !== undefined) {
    link(e, activeSub)

    if (!ignoreLazy && activeSub[$$flags] & LazyEffectSubscriberFlag) {
      e[$$flags] |= LazyEffectSubscriberFlag
      return effectStop.bind(e)
    }
  }

  runEffect(e, true)

  return effectStop.bind(e)
}

function createEffectScopeInstance(): EffectScope {
  return {
    [$$subs]: undefined,
    [$$subsTail]: undefined,
    [$$deps]: undefined,
    [$$depsTail]: undefined,
    [$$flags]: EffectSubscriberFlag | EffectScopeSubscriberFlag
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

  if (lazy || activeSub !== undefined && activeSub[$$flags] & LazyEffectSubscriberFlag) {
    e[$$flags] |= LazyEffectSubscriberFlag
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
export function createEffectScope() {
  return runEffectScopeInstance.bind(null, createEffectScopeInstance()) as typeof effectScope
}
