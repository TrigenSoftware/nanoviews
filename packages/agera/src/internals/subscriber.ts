import type {
  Dependency,
  Effect,
  EffectScope,
  Link,
  Signal,
  Subscriber
} from './types.js'
import {
  $$subs,
  $$subsTail,
  $$flags,
  $$deps,
  $$depsTail,
  $$dep,
  $$nextDep,
  $$prevSub,
  $$nextSub,
  $$onActivate,
  $$destroy
} from './symbols.js'
import {
  DirtySubscriberFlag,
  TrackingSubscriberFlag,
  NotifiedSubscriberFlag,
  RecursedSubscriberFlag,
  PropagatedSubscriberFlag,
  EffectScopeSubscriberFlag,
  LazyEffectSubscriberFlag
} from './flags.js'
import { notifyActivateListeners } from './lifecycle.js'
import { runEffect } from './effect.js'

export function maybeDestroyEffect(dep: Dependency | Subscriber): void {
  if ($$destroy in dep && dep[$$destroy] !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    (dep as Effect)[$$destroy]!()
    dep[$$destroy] = undefined
  }
}

/**
 * Clears dependency-subscription relationships starting at the given link.
 *
 * Detaches the link from both the dependency and subscriber, then continues
 * to the next link in the chain. The link objects are returned to linkPool for reuse.
 * @param link - The head of a linked chain to be cleared.
 */
export function clearTracking(link: Link): void {
  do {
    const dep = link[$$dep]
    const nextDep = link[$$nextDep]
    const nextSub = link[$$nextSub]
    const prevSub = link[$$prevSub]

    if (nextSub !== undefined) {
      nextSub[$$prevSub] = prevSub
    } else {
      dep[$$subsTail] = prevSub
    }

    if (prevSub !== undefined) {
      prevSub[$$nextSub] = nextSub
    } else {
      dep[$$subs] = nextSub

      if (nextSub === undefined) {
        if ($$onActivate in dep) {
          (dep as Signal)[$$onActivate]!(false)
        } else {
          maybeDestroyEffect(dep)
        }
      }
    }

    if (dep[$$subs] === undefined && $$deps in dep) {
      const depFlags = dep[$$flags]

      if (!(depFlags & DirtySubscriberFlag)) {
        dep[$$flags] = depFlags | DirtySubscriberFlag
      }

      const depDeps = dep[$$deps]

      if (depDeps !== undefined) {
        link = depDeps
        dep[$$depsTail]![$$nextDep] = nextDep
        dep[$$deps] = undefined
        dep[$$depsTail] = undefined
        continue
      }
    }

    link = nextDep!
  } while (link !== undefined)
}

/**
 * Prepares the given subscriber to track new dependencies.
 *
 * It resets the subscriber's internal pointers (e.g., depsTail) and
 * sets its flags to indicate it is now tracking dependency links.
 * @param sub - The subscriber to start tracking.
 */
export function startTracking(sub: Subscriber): void {
  sub[$$depsTail] = undefined
  sub[$$flags] = (sub[$$flags] & ~(NotifiedSubscriberFlag | RecursedSubscriberFlag | PropagatedSubscriberFlag)) | TrackingSubscriberFlag
}

/**
 * Concludes tracking of dependencies for the specified subscriber.
 *
 * It clears or unlinks any tracked dependency information, then
 * updates the subscriber's flags to indicate tracking is complete.
 * @param sub - The subscriber whose tracking is ending.
 */
export function endTracking(sub: Subscriber): void {
  const depsTail = sub[$$depsTail]

  if (depsTail !== undefined) {
    const nextDep = depsTail[$$nextDep]

    if (nextDep !== undefined) {
      clearTracking(nextDep)
      depsTail[$$nextDep] = undefined
    }
  } else if (sub[$$deps] !== undefined) {
    clearTracking(sub[$$deps])
    sub[$$deps] = undefined
  }

  sub[$$flags] &= ~TrackingSubscriberFlag

  notifyActivateListeners()
}

/**
 * @todo Remove recursion in favor of a loop.
 * @param link - The head of a linked chain to be propagated.
 */
export function runLazyEffects(link: Link): void {
  do {
    const dep = link[$$dep] as Effect | EffectScope
    const nextDep = link[$$nextDep]

    if (dep[$$flags] & LazyEffectSubscriberFlag) {
      dep[$$flags] &= ~LazyEffectSubscriberFlag

      if (dep[$$flags] & EffectScopeSubscriberFlag) {
        if (dep[$$deps] !== undefined) {
          runLazyEffects(dep[$$deps])
        }
      } else {
        runEffect(dep as Effect, true)
      }
    }

    link = nextDep!
  } while (link !== undefined)
}
