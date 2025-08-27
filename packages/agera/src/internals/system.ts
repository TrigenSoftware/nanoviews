import type {
  Dependency,
  Link,
  Subscriber,
  Signal,
  ComputedSignal,
  Effect,
  EffectScope
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
  $$destroy,
  $$sub,
  $$value,
  $$compute,
  $$effect
} from './symbols.js'
import {
  DirtySubscriberFlag,
  TrackingSubscriberFlag,
  NotifiedSubscriberFlag,
  RecursedSubscriberFlag,
  PropagatedSubscriberFlag,
  EffectScopeSubscriberFlag,
  LazyEffectSubscriberFlag,
  PendingComputedSubscriberFlag,
  EffectSubscriberFlag,
  PendingEffectSubscriberFlag,
  ComputedSubscriberFlag
} from './flags.js'
import {
  incrementEffectCount,
  isActiveSubscriber,
  decrementEffectCount,
  notifyActivations
} from './activation.js'

/**
 * Creates and attaches a new link between the given dependency and subscriber.
 *
 * Reuses a link object from the linkPool if available. The newly formed link
 * is added to both the dependency's linked list and the subscriber's linked list.
 * @param dep - The dependency to link.
 * @param sub - The subscriber to be attached to this dependency.
 * @param nextDep - The next link in the subscriber's chain.
 * @param depsTail - The current tail link in the subscriber's chain.
 * @returns The newly created link object.
 */
export function linkNewDep(
  dep: Dependency | Signal | ComputedSignal,
  sub: Subscriber | ComputedSignal,
  nextDep: Link | undefined,
  depsTail: Link | undefined
): Link {
  const newLink: Link = {
    [$$dep]: dep,
    [$$sub]: sub,
    [$$nextDep]: nextDep,
    [$$prevSub]: undefined,
    [$$nextSub]: undefined
  }

  if (depsTail === undefined) {
    sub[$$deps] = newLink
  } else {
    depsTail[$$nextDep] = newLink
  }

  if (dep[$$subs] === undefined) {
    dep[$$subs] = newLink
  } else {
    const oldTail = dep[$$subsTail]!

    newLink[$$prevSub] = oldTail
    oldTail[$$nextSub] = newLink
  }

  sub[$$depsTail] = newLink
  dep[$$subsTail] = newLink

  if (isActiveSubscriber(sub)) {
    incrementEffectCount(dep)
  }

  return newLink
}

/**
 * Verifies whether the given link is valid for the specified subscriber.
 *
 * It iterates through the subscriber's link list (from sub[$$deps] to sub[$$depsTail])
 * to determine if the provided link object is part of that chain.
 * @param checkLink - The link object to validate.
 * @param sub - The subscriber whose link list is being checked.
 * @returns `true` if the link is found in the subscriber's list; otherwise `false`.
 */
export function isValidLink(checkLink: Link, sub: Subscriber): boolean {
  const depsTail = sub[$$depsTail]

  if (depsTail !== undefined) {
    let link = sub[$$deps]!

    do {
      if (link === checkLink) {
        return true
      }

      if (link === depsTail) {
        break
      }

      link = link[$$nextDep]!
    } while (link !== undefined)
  }

  return false
}

/**
 * Links a given dependency and subscriber if they are not already linked.
 * @param dep - The dependency to be linked.
 * @param sub - The subscriber that depends on this dependency.
 * @returns The newly created link object if the two are not already linked; otherwise `undefined`.
 */
export function link(dep: Dependency, sub: Subscriber): Link | undefined {
  const currentDep = sub[$$depsTail]

  if (currentDep !== undefined && currentDep[$$dep] === dep) {
    return
  }

  const nextDep = currentDep !== undefined
    ? currentDep[$$nextDep]
    : sub[$$deps]

  if (nextDep !== undefined && nextDep[$$dep] === dep) {
    sub[$$depsTail] = nextDep
    return
  }

  const depLastSub = dep[$$subsTail]

  if (
    depLastSub !== undefined
    && depLastSub[$$sub] === sub
    && isValidLink(depLastSub, sub)
  ) {
    return
  }

  return linkNewDep(dep, sub, nextDep, currentDep)
}

const pauseStack: (Subscriber | undefined)[] = []

// eslint-disable-next-line import/no-mutable-exports
export let activeSub: Subscriber | EffectScope | undefined

let queuedEffects: Subscriber | undefined
let queuedEffectsTail: Subscriber | undefined

export function updateComputed<T>(computed: ComputedSignal<T>): boolean {
  const prevSub = activeSub

  activeSub = computed
  startTracking(computed)

  try {
    const oldValue = computed[$$value]
    const newValue = computed[$$compute](oldValue)

    if (oldValue !== newValue) {
      computed[$$value] = newValue
      return true
    }

    return false
  } finally {
    activeSub = prevSub
    endTracking(computed)
  }
}

/**
 * Quickly propagates PendingComputed status to Dirty for each subscriber in the chain.
 *
 * If the subscriber is also marked as an effect, it is added to the queuedEffects list
 * for later processing.
 * @param link - The head of the linked list to process.
 */
export function shallowPropagate(link: Link): void {
  do {
    const sub = link[$$sub]
    const subFlags = sub[$$flags]

    if ((subFlags & (PendingComputedSubscriberFlag | DirtySubscriberFlag)) === PendingComputedSubscriberFlag) {
      sub[$$flags] = subFlags | DirtySubscriberFlag | NotifiedSubscriberFlag

      if ((subFlags & (EffectSubscriberFlag | NotifiedSubscriberFlag)) === EffectSubscriberFlag) {
        if (queuedEffectsTail !== undefined) {
          queuedEffectsTail[$$depsTail]![$$nextDep] = sub[$$deps]
        } else {
          queuedEffects = sub
        }

        queuedEffectsTail = sub
      }
    }

    link = link[$$nextSub]!
  } while (link !== undefined)
}

/**
 * Traverses and marks subscribers starting from the provided link.
 *
 * It sets flags (e.g., Dirty, PendingComputed, PendingEffect) on each subscriber
 * to indicate which ones require re-computation or effect processing.
 * This function should be called after a signal's value changes.
 * @param link - The starting link from which propagation begins.
 */
export function propagate(link: Link): void {
  let targetFlag = DirtySubscriberFlag
  let subs = link
  let stack = 0

  top: do {
    const sub = link[$$sub]
    const subFlags = sub[$$flags]

    if (
      (
        !(subFlags & (TrackingSubscriberFlag | RecursedSubscriberFlag | PropagatedSubscriberFlag))
        && (sub[$$flags] = subFlags | targetFlag | NotifiedSubscriberFlag, true)
      )
      || (
        (subFlags & RecursedSubscriberFlag)
        && !(subFlags & TrackingSubscriberFlag)
        && (sub[$$flags] = (subFlags & ~RecursedSubscriberFlag) | targetFlag | NotifiedSubscriberFlag, true)
      )
      || (
        !(subFlags & PropagatedSubscriberFlag)
        && isValidLink(link, sub)
        && (
          sub[$$flags] = subFlags | RecursedSubscriberFlag | targetFlag | NotifiedSubscriberFlag,
          (sub as Dependency)[$$subs] !== undefined
        )
      )
    ) {
      const subSubs = (sub as Dependency)[$$subs]

      if (subSubs !== undefined) {
        if (subSubs[$$nextSub] !== undefined) {
          subSubs[$$prevSub] = subs
          link = subs = subSubs
          targetFlag = PendingComputedSubscriberFlag
          ++stack
        } else {
          link = subSubs
          targetFlag = subFlags & EffectSubscriberFlag
            ? PendingEffectSubscriberFlag
            : PendingComputedSubscriberFlag
        }

        continue
      }

      if (subFlags & EffectSubscriberFlag) {
        if (queuedEffectsTail !== undefined) {
          queuedEffectsTail[$$depsTail]![$$nextDep] = sub[$$deps]
        } else {
          queuedEffects = sub
        }

        queuedEffectsTail = sub
      }
    } else if (!(subFlags & (TrackingSubscriberFlag | targetFlag))) {
      sub[$$flags] = subFlags | targetFlag | NotifiedSubscriberFlag

      if ((subFlags & (EffectSubscriberFlag | NotifiedSubscriberFlag)) === EffectSubscriberFlag) {
        if (queuedEffectsTail !== undefined) {
          queuedEffectsTail[$$depsTail]![$$nextDep] = sub[$$deps]
        } else {
          queuedEffects = sub
        }

        queuedEffectsTail = sub
      }
    } else if (
      !(subFlags & targetFlag)
      && (subFlags & PropagatedSubscriberFlag)
      && isValidLink(link, sub)
    ) {
      sub[$$flags] = subFlags | targetFlag
    }

    if ((link = subs[$$nextSub]!) !== undefined) {
      subs = link
      targetFlag = stack
        ? PendingComputedSubscriberFlag
        : DirtySubscriberFlag
      continue
    }

    while (stack) {
      --stack

      const dep = subs[$$dep]
      const depSubs = dep[$$subs]!

      subs = depSubs[$$prevSub]!
      depSubs[$$prevSub] = undefined

      if ((link = subs[$$nextSub]!) !== undefined) {
        subs = link
        targetFlag = stack
          ? PendingComputedSubscriberFlag
          : DirtySubscriberFlag
        continue top
      }
    }

    break
  } while (true)
}

/**
 * Recursively checks and updates all computed subscribers marked as pending.
 *
 * It traverses the linked structure using a stack mechanism. For each computed
 * subscriber in a pending state, updateComputed is called and shallowPropagate
 * is triggered if a value changes. Returns whether any updates occurred.
 * @param link - The starting link representing a sequence of pending computeds.
 * @returns `true` if a computed was updated, otherwise `false`.
 */
export function checkDirty(link: Link): boolean {
  let stack = 0
  let dirty: boolean

  top: do {
    dirty = false

    const dep = link[$$dep]

    if ($$flags in dep) {
      const depFlags = dep[$$flags]

      if ((depFlags & (ComputedSubscriberFlag | DirtySubscriberFlag)) === (ComputedSubscriberFlag | DirtySubscriberFlag)) {
        if (updateComputed(dep as ComputedSignal)) {
          const subs = dep[$$subs]!

          if (subs[$$nextSub] !== undefined) {
            shallowPropagate(subs)
          }

          dirty = true
        }
      } else if ((depFlags & (ComputedSubscriberFlag | PendingComputedSubscriberFlag)) === (ComputedSubscriberFlag | PendingComputedSubscriberFlag)) {
        const depSubs = dep[$$subs]!

        if (depSubs[$$nextSub] !== undefined) {
          depSubs[$$prevSub] = link
        }

        link = dep[$$deps]!
        ++stack
        continue
      }
    }

    if (!dirty && link[$$nextDep] !== undefined) {
      link = link[$$nextDep]
      continue
    }

    if (stack) {
      let sub = link[$$sub] as ComputedSignal

      do {
        --stack

        const subSubs = sub[$$subs]!

        if (dirty) {
          if (updateComputed(sub)) {
            if ((link = subSubs[$$prevSub]!) !== undefined) {
              subSubs[$$prevSub] = undefined
              shallowPropagate(subSubs)
              sub = link[$$sub] as ComputedSignal
            } else {
              sub = subSubs[$$sub] as ComputedSignal
            }

            continue
          }
        } else {
          sub[$$flags] &= ~PendingComputedSubscriberFlag
        }

        if ((link = subSubs[$$prevSub]!) !== undefined) {
          subSubs[$$prevSub] = undefined

          if (link[$$nextDep] !== undefined) {
            link = link[$$nextDep]
            continue top
          }

          sub = link[$$sub] as ComputedSignal
        } else {
          if ((link = subSubs[$$nextDep]!) !== undefined) {
            continue top
          }

          sub = subSubs[$$sub] as ComputedSignal
        }

        dirty = false
      } while (stack)
    }

    return dirty
  } while (true)
}

/**
 * Updates the dirty flag for the given subscriber based on its dependencies.
 *
 * If the subscriber has any pending computeds, this function sets the Dirty flag
 * and returns `true`. Otherwise, it clears the PendingComputed flag and returns `false`.
 * @param sub - The subscriber to update.
 * @param flags - The current flag set for this subscriber.
 * @returns `true` if the subscriber is marked as Dirty; otherwise `false`.
 */
export function updateDirtyFlag(sub: Subscriber, flags: number): boolean {
  if (checkDirty(sub[$$deps]!)) {
    sub[$$flags] = flags | DirtySubscriberFlag
    return true
  }

  sub[$$flags] = flags & ~PendingComputedSubscriberFlag

  return false
}

/**
 * Updates the computed subscriber if necessary before its value is accessed.
 *
 * If the subscriber is marked Dirty or PendingComputed, this function runs
 * the provided updateComputed logic and triggers a shallowPropagate for any
 * downstream subscribers if an actual update occurs.
 * @param computed - The computed subscriber to update.
 * @param flags - The current flag set for this subscriber.
 */
export function processComputedUpdate<T>(computed: ComputedSignal<T>, flags: number): void {
  if (
    flags & DirtySubscriberFlag
    || (
      checkDirty(computed[$$deps]!) || (computed[$$flags] = flags & ~PendingComputedSubscriberFlag, false)
    )
  ) {
    if (updateComputed(computed)) {
      const subs = computed[$$subs]

      if (subs !== undefined) {
        shallowPropagate(subs)
      }
    }
  }
}

/**
 * Ensures all pending internal effects for the given subscriber are processed.
 *
 * This should be called after an effect decides not to re-run itself but may still
 * have dependencies flagged with PendingEffect. If the subscriber is flagged with
 * PendingEffect, this function clears that flag and invokes `notifyEffect` on any
 * related dependencies marked as Effect and Propagated, processing pending effects.
 * @param sub - The subscriber which may have pending effects.
 * @param flags - The current flags on the subscriber to check.
 */
export function processPendingInnerEffects(sub: Subscriber, flags: number): void {
  if (flags & PendingEffectSubscriberFlag) {
    sub[$$flags] = flags & ~PendingEffectSubscriberFlag

    let link = sub[$$deps]!

    do {
      const dep = link[$$dep]

      if (
        $$flags in dep
        && dep[$$flags] & EffectSubscriberFlag
        && dep[$$flags] & PropagatedSubscriberFlag
      ) {
        notifyEffect(dep as Effect | EffectScope)
      }

      link = link[$$nextDep]!
    } while (link !== undefined)
  }
}

export function runEffect(e: Effect, warmup?: true): void {
  const prevSub = activeSub

  activeSub = e
  startTracking(e)

  try {
    if (e[$$destroy] !== undefined) {
      e[$$destroy]()
    }

    e[$$destroy] = e[$$effect](warmup)
  } finally {
    activeSub = prevSub
    endTracking(e)
  }
}

export function runEffectScope(e: EffectScope, fn: () => void): void {
  const prevSub = activeSub

  activeSub = e

  try {
    fn()
  } finally {
    activeSub = prevSub
  }
}

export function notifyEffect(e: Effect | EffectScope) {
  if (e[$$flags] & EffectScopeSubscriberFlag) {
    return notifyEffectScope(e as EffectScope)
  }

  return notifyEffectSub(e as Effect)
}

export function notifyEffectSub(e: Effect): boolean {
  const flags = e[$$flags]

  if (
    flags & DirtySubscriberFlag
    || (flags & PendingComputedSubscriberFlag && updateDirtyFlag(e, flags))
  ) {
    runEffect(e)
  } else {
    processPendingInnerEffects(e, e[$$flags])
  }

  return true
}

export function notifyEffectScope(e: EffectScope): boolean {
  const flags = e[$$flags]

  if (flags & PendingEffectSubscriberFlag) {
    processPendingInnerEffects(e, e[$$flags])
    return true
  }

  return false
}

/**
 * Processes queued effect notifications after a batch operation finishes.
 *
 * Iterates through all queued effects, calling notifyEffect on each.
 * If an effect remains partially handled, its flags are updated, and future
 * notifications may be triggered until fully handled.
 */
export function processEffectNotifications(): void {
  while (queuedEffects !== undefined) {
    const effect = queuedEffects
    const depsTail = effect[$$depsTail]
    // effect can be destroyed previously while notifying
    const queuedNext = depsTail?.[$$nextDep]

    if (queuedNext !== undefined) {
      depsTail![$$nextDep] = undefined
      queuedEffects = queuedNext[$$sub]
    } else {
      queuedEffects = undefined
      queuedEffectsTail = undefined
    }

    if (!notifyEffect(effect as EffectScope | Effect)) {
      effect[$$flags] &= ~NotifiedSubscriberFlag
    }
  }
}

/**
 * Pauses signal change tracking.
 */
export function pauseTracking() {
  pauseStack.push(activeSub)
  activeSub = undefined
}

/**
 * Resumes signal change tracking.
 */
export function resumeTracking() {
  activeSub = pauseStack.pop()
}

export function maybeDestroyEffect(dep: Dependency | Subscriber): void {
  if ($$destroy in dep && dep[$$destroy] !== undefined) {
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
  const isActiveSource = isActiveSubscriber(link[$$sub])

  do {
    const dep = link[$$dep] as Dependency | Dependency & Subscriber | Signal
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
        maybeDestroyEffect(dep)
      }
    }

    const shouldClearSubs = dep[$$subs] === undefined && $$deps in dep

    if (isActiveSource) {
      decrementEffectCount(dep, shouldClearSubs)
    }

    if (shouldClearSubs) {
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

  notifyActivations(activeSub)
}

/**
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
