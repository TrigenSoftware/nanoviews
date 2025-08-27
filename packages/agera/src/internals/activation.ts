import type {
  ActivateListener,
  OnActivateCallback,
  Subscriber,
  Dependency,
  Signal,
  ComputedSignal,
  Link,
  EffectScope
} from './types.js'
import {
  $$flags,
  $$deps,
  $$dep,
  $$nextDep,
  $$nextSub,
  $$onActivate,
  $$effects
} from './symbols.js'
import {
  EffectScopeSubscriberFlag,
  EffectSubscriberFlag,
  LazyEffectSubscriberFlag
} from './flags.js'

let activations: ActivateListener | undefined
let activationsTail: ActivateListener | undefined

function queueActivation(onActivate: OnActivateCallback): void {
  const listener: ActivateListener = {
    [$$onActivate]: onActivate,
    [$$nextSub]: undefined
  }

  if (activationsTail === undefined) {
    activations = listener
  } else {
    activationsTail[$$nextSub] = listener
  }

  activationsTail = listener
}

export function notifyActivations(
  activeSub: Subscriber | EffectScope | undefined
): void {
  if (
    activations !== undefined
    && (activeSub === undefined || (activeSub[$$flags] & EffectScopeSubscriberFlag) && !(activeSub[$$flags] & LazyEffectSubscriberFlag))
  ) {
    let listener = activations

    activations = undefined
    activationsTail = undefined

    do {
      listener[$$onActivate](true)
      listener = listener[$$nextSub]!
    } while (listener !== undefined)
  }
}

export function isActiveSubscriber(sub: Subscriber | ComputedSignal): boolean {
  return (sub[$$flags] & EffectSubscriberFlag) > 0 || $$effects in sub && sub[$$effects] > 0
}

export function incrementEffectCount(dep: Dependency | Signal | ComputedSignal): void {
  if ($$effects in dep) {
    dep[$$effects]++

    if ($$deps in dep && dep[$$deps] !== undefined) {
      propagateActivation(dep[$$deps])
    }

    if (dep[$$effects] === 1 && $$onActivate in dep) {
      queueActivation(dep[$$onActivate]!)
    }
  }
}

function propagateActivation(link: Link): void {
  do {
    incrementEffectCount(link[$$dep])
    link = link[$$nextDep]!
  } while (link !== undefined)
}

export function decrementEffectCount(
  dep: Dependency | Signal | ComputedSignal,
  skipPropagation?: boolean
): void {
  if ($$effects in dep && dep[$$effects] > 0) {
    dep[$$effects]--

    if (!skipPropagation && $$deps in dep && dep[$$deps] !== undefined) {
      propagateDeactivation(dep[$$deps])
    }

    if (dep[$$effects] === 0 && $$onActivate in dep) {
      dep[$$onActivate]!(false)
    }
  }
}

function propagateDeactivation(link: Link): void {
  do {
    decrementEffectCount(link[$$dep])
    link = link[$$nextDep]!
  } while (link !== undefined)
}
