import type {
  ActivateListener,
  OnActivateCallback
} from './types.js'
import {
  $$nextSub,
  $$onActivate
} from './symbols.js'

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
  if (activateListeners !== undefined) {
    let listener = activateListeners

    activateListeners = undefined
    activateListenersTail = undefined

    do {
      listener[$$onActivate](true)
      listener = listener[$$nextSub]!
    } while (listener !== undefined)
  }
}
