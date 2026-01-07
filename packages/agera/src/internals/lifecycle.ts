import type {
  MountedCallback,
  Subscriber,
  Dependency,
  SignalInstance,
  ComputedSignalInstance,
  Link,
  EffectScope,
  AnySignal,
  ReadableSignal
} from './types.js'
import {
  EffectScopeSubscriberFlag,
  EffectSubscriberFlag,
  LazyEffectSubscriberFlag
} from './flags.js'

interface MountedListener {
  mounted: MountedCallback
  nextSub: MountedListener | undefined
}

let mountedListeners: MountedListener | undefined
let mountedListenersTail: MountedListener | undefined

function queueMounted(onMounted: MountedCallback): void {
  const listener: MountedListener = {
    mounted: onMounted,
    nextSub: undefined
  }

  if (mountedListenersTail === undefined) {
    mountedListeners = listener
  } else {
    mountedListenersTail.nextSub = listener
  }

  mountedListenersTail = listener
}

export function notifyMounted(
  activeSub: Subscriber | EffectScope | undefined
): void {
  if (
    mountedListeners !== undefined
    && (activeSub === undefined || (activeSub.flags & EffectScopeSubscriberFlag) && !(activeSub.flags & LazyEffectSubscriberFlag))
  ) {
    let listener = mountedListeners

    mountedListeners = undefined
    mountedListenersTail = undefined

    do {
      listener.mounted(true)
      listener = listener.nextSub!
    } while (listener !== undefined)
  }
}

/* @__NO_SIDE_EFFECTS__ */
export function isActiveSubscriber(sub: Subscriber | ComputedSignalInstance): boolean {
  return (sub.flags & EffectSubscriberFlag) > 0 || 'subsCount' in sub && sub.subsCount > 0
}

export function incrementEffectCount(dep: Dependency | SignalInstance | ComputedSignalInstance): void {
  if ('subsCount' in dep) {
    dep.subsCount++

    if ('deps' in dep && dep.deps !== undefined) {
      propagateActivation(dep.deps)
    }

    if (dep.subsCount === 1 && 'mounted' in dep) {
      queueMounted(dep.mounted!)
    }
  }
}

function propagateActivation(link: Link): void {
  do {
    incrementEffectCount(link.dep)
    link = link.nextDep!
  } while (link !== undefined)
}

export function decrementEffectCount(
  dep: Dependency | SignalInstance | ComputedSignalInstance,
  skipPropagation?: boolean
): void {
  if ('subsCount' in dep && dep.subsCount > 0) {
    dep.subsCount--

    if (!skipPropagation && 'deps' in dep && dep.deps !== undefined) {
      propagateDeactivation(dep.deps)
    }

    if (dep.subsCount === 0 && 'mounted' in dep) {
      dep.mounted!(false)
    }
  }
}

function propagateDeactivation(link: Link): void {
  do {
    decrementEffectCount(link.dep)
    link = link.nextDep!
  } while (link !== undefined)
}

// eslint-disable-next-line import/no-mutable-exports
export let isMountableUsed = false

export function markMountableUsed() {
  isMountableUsed = true
}

// eslint-disable-next-line import/no-mutable-exports
export let activeNoMount: SignalInstance | undefined

export function pushNoMount(signal: SignalInstance | undefined) {
  const prevNoMount = activeNoMount

  activeNoMount = signal

  return prevNoMount
}

export function popNoMount(prevNoMount: SignalInstance | undefined) {
  activeNoMount = prevNoMount
}

/**
 * Get the valie of a signal without mount trigger.
 * @param $signal - The signal to get the value from.
 * @returns The value of the signal.
 */
export function noMount<T>($signal: ReadableSignal<T>): T

/**
 * Call a function without signal mount trigger.
 * @param $signal - The signal to ignore mount for.
 * @param fn - The function to call.
 * @returns The result of the function.
 */
export function noMount<T>($signal: AnySignal, fn: () => T): T

export function noMount($signal: AnySignal, fn: () => unknown = $signal) {
  const prevSkipMount = pushNoMount($signal.signal)

  try {
    return fn()
  } finally {
    popNoMount(prevSkipMount)
  }
}
