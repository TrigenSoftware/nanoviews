import type {
  ActivateListener,
  OnActivateCallback
} from './types.js'
import {
  $$flags,
  $$nextSub,
  $$onActivate
} from './symbols.js'
import {
  EffectScopeSubscriberFlag,
  LazyEffectSubscriberFlag
} from './flags.js'
import { activeSub } from './effect.js'

let activateListeners: ActivateListener | undefined
let activateListenersTail: ActivateListener | undefined

export function queueActivateListener(onActivate: OnActivateCallback): void {
  const listener: ActivateListener = {
    [$$onActivate]: onActivate,
    [$$nextSub]: undefined
  }

  if (activateListenersTail === undefined) {
    activateListeners = listener
  } else {
    activateListenersTail[$$nextSub] = listener
  }

  activateListenersTail = listener
}

export function notifyActivateListeners(): void {
  if (
    activateListeners !== undefined
    && (activeSub === undefined || (activeSub[$$flags] & EffectScopeSubscriberFlag) && !(activeSub[$$flags] & LazyEffectSubscriberFlag))
  ) {
    let listener = activateListeners

    activateListeners = undefined
    activateListenersTail = undefined

    do {
      listener[$$onActivate](true)
      listener = listener[$$nextSub]!
    } while (listener !== undefined)
  }
}
