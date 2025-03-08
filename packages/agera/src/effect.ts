
import {
  type Subscriber,
  type Effect,
  type EffectScope,
  type EffectCallback,
  $$subs,
  $$subsTail,
  $$flags,
  $$deps,
  $$depsTail,
  $$isScope,
  $$effect,
  $$destroy,
  EffectSubscriberFlag,
  LazyEffectSubscriberFlag,
  link,
  runEffect,
  runEffectScope,
  runLazyEffects,
  startTracking,
  endTracking,
  maybeDestroyEffect,
  activeSub,
  activeScope
} from './internals/index.js'

function effectStop(this: Subscriber | Effect): void {
  startTracking(this)
  maybeDestroyEffect(this)
  endTracking(this)
}

function lazyEffectsRun(this: EffectScope): () => void {
  if (this[$$deps] !== undefined) {
    runLazyEffects(this[$$deps])
  }

  return effectStop.bind(this)
}

function inheritLazyFlag(
  e: Effect | EffectScope,
  force?: boolean
): boolean {
  if (force || activeScope !== undefined && activeScope[$$flags] & LazyEffectSubscriberFlag) {
    e[$$flags] |= LazyEffectSubscriberFlag

    return false
  }

  return true
}

/**
 * Run effect function and re-run it on dependency change.
 * @param fn - The effect function to run.
 * @returns A function to stop the effect.
 */
export function effect(fn: EffectCallback): () => void {
  const e: Effect = {
    [$$effect]: fn,
    [$$subs]: undefined,
    [$$subsTail]: undefined,
    [$$deps]: undefined,
    [$$depsTail]: undefined,
    [$$flags]: EffectSubscriberFlag,
    [$$destroy]: undefined
  }

  if (activeScope !== undefined) {
    link(e, activeScope)
  } else if (activeSub !== undefined) {
    link(e, activeSub)
  }

  if (inheritLazyFlag(e)) {
    runEffect(e, true)
  }

  return effectStop.bind(e)
}

/**
 * Run effect scope function to group effects.
 * @param fn - The effect scope function to run.
 * @returns A function to stop child effects.
 */
export function effectScope(fn: () => void): () => void

/**
 * Run effect scope function to group effects.
 * @param fn - The effect scope function to run.
 * @param lazy - Whether to run the effects lazily.
 * @returns A function to start child effects.
 */
export function effectScope(
  fn: () => void,
  lazy: true
): () => () => void

export function effectScope(
  fn: () => void,
  lazy?: boolean
): (() => void) | (() => () => void) {
  const e: EffectScope = {
    [$$subs]: undefined,
    [$$subsTail]: undefined,
    [$$deps]: undefined,
    [$$depsTail]: undefined,
    [$$flags]: EffectSubscriberFlag,
    [$$isScope]: true
  }

  if (activeScope !== undefined) {
    link(e, activeScope)
  }

  inheritLazyFlag(e, lazy)
  runEffectScope(e, fn)

  if (lazy) {
    return lazyEffectsRun.bind(e)
  }

  return effectStop.bind(e)
}
