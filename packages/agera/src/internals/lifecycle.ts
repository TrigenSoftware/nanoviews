import type {
  MountedListener,
  MountedCallback,
  Subscriber,
  Dependency,
  SignalInstance,
  ComputedSignalInstance,
  Link,
  EffectScope
} from './types.js'
import {
  $$flags,
  $$deps,
  $$dep,
  $$nextDep,
  $$nextSub,
  $$mounted,
  $$subsCount
} from './symbols.js'
import {
  EffectScopeSubscriberFlag,
  EffectSubscriberFlag,
  LazyEffectSubscriberFlag
} from './flags.js'

let mountedListeners: MountedListener | undefined
let mountedListenersTail: MountedListener | undefined

function queueMounted(onMounted: MountedCallback): void {
  const listener: MountedListener = {
    [$$mounted]: onMounted,
    [$$nextSub]: undefined
  }

  if (mountedListenersTail === undefined) {
    mountedListeners = listener
  } else {
    mountedListenersTail[$$nextSub] = listener
  }

  mountedListenersTail = listener
}

export function notifyMounted(
  activeSub: Subscriber | EffectScope | undefined
): void {
  if (
    mountedListeners !== undefined
    && (activeSub === undefined || (activeSub[$$flags] & EffectScopeSubscriberFlag) && !(activeSub[$$flags] & LazyEffectSubscriberFlag))
  ) {
    let listener = mountedListeners

    mountedListeners = undefined
    mountedListenersTail = undefined

    do {
      listener[$$mounted](true)
      listener = listener[$$nextSub]!
    } while (listener !== undefined)
  }
}

/* @__NO_SIDE_EFFECTS__ */
export function isActiveSubscriber(sub: Subscriber | ComputedSignalInstance): boolean {
  return (sub[$$flags] & EffectSubscriberFlag) > 0 || $$subsCount in sub && sub[$$subsCount] > 0
}

export function incrementEffectCount(dep: Dependency | SignalInstance | ComputedSignalInstance): void {
  if ($$subsCount in dep) {
    dep[$$subsCount]++

    if ($$deps in dep && dep[$$deps] !== undefined) {
      propagateActivation(dep[$$deps])
    }

    if (dep[$$subsCount] === 1 && $$mounted in dep) {
      queueMounted(dep[$$mounted]!)
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
  dep: Dependency | SignalInstance | ComputedSignalInstance,
  skipPropagation?: boolean
): void {
  if ($$subsCount in dep && dep[$$subsCount] > 0) {
    dep[$$subsCount]--

    if (!skipPropagation && $$deps in dep && dep[$$deps] !== undefined) {
      propagateDeactivation(dep[$$deps])
    }

    if (dep[$$subsCount] === 0 && $$mounted in dep) {
      dep[$$mounted]!(false)
    }
  }
}

function propagateDeactivation(link: Link): void {
  do {
    decrementEffectCount(link[$$dep])
    link = link[$$nextDep]!
  } while (link !== undefined)
}

// eslint-disable-next-line import/no-mutable-exports
export let isMountableUsed = false

export function markMountableUsed() {
  isMountableUsed = true
}

// eslint-disable-next-line import/no-mutable-exports
export let activeSkipMount: SignalInstance | undefined

export function skipMount<T>(instance: SignalInstance, fn: () => T): T {
  const prevSkipMount = activeSkipMount

  activeSkipMount = instance

  try {
    return fn()
  } finally {
    activeSkipMount = prevSkipMount
  }
}
