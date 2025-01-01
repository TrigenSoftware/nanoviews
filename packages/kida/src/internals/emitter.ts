import type {
  EventKey,
  EventListener,
  EventTarget
} from './types/index.js'
import { $$CHANGE } from './symbols.js'

const QUEUE_PACKET_SIZE = 3
const queue: (EventListener | unknown)[] = []
let queueIndex = 0

// eslint-disable-next-line import/no-mutable-exports
export let epoch = 0

const MAX_EPOCH = 1073741824

export function checkEpoch() {
  if (epoch >= MAX_EPOCH) {
    epoch = 0
  }
}

export function addListener(
  target: {},
  event: EventKey,
  listener: EventListener
): EventListener[]

export function addListener(
  target: EventTarget,
  event: EventKey,
  listener: EventListener
) {
  let listeners = target[event]

  if (listeners) {
    listeners.push(listener)
  } else {
    target[event] = listeners = [listener]
  }

  return listeners
}

export function removeListener(
  listeners: EventListener[],
  listener: EventListener
) {
  const index = listeners.indexOf(listener)

  if (~index) {
    listeners.splice(index, 1)

    return !listeners.length
  }

  return false
}

export function cleanupQueue(listener: EventListener) {
  for (let i = queueIndex + QUEUE_PACKET_SIZE; i < queue.length;) {
    if (queue[i] === listener) {
      queue.splice(i, QUEUE_PACKET_SIZE)
    } else {
      i += QUEUE_PACKET_SIZE
    }
  }
}

export function dispatchLifecycle(
  target: {},
  event: EventKey,
  args?: unknown[]
): void

export function dispatchLifecycle(
  target: EventTarget,
  event: EventKey,
  args: unknown[] = []
) {
  const listeners = target[event]

  if (listeners) {
    const handlersCount = listeners.length

    if (handlersCount) {
      const shared = {}

      for (let i = 0; i < handlersCount; i++) {
        listeners[i](...args, shared)
      }
    }
  }
}

export function dispatchAbortableLifecycle(
  target: {},
  event: EventKey,
  args?: unknown[]
): boolean

export function dispatchAbortableLifecycle(
  target: EventTarget,
  event: EventKey,
  args: unknown[] = []
) {
  let result = true

  dispatchLifecycle(target, event, [
    ...args,
    () => {
      result = false
    }
  ])

  return result
}

export function dispatchChange(
  target: {},
  value: unknown,
  prevValue: unknown
): void

export function dispatchChange(
  target: EventTarget,
  value: unknown,
  prevValue: unknown
) {
  epoch++

  const listeners = target[$$CHANGE]
  const listenersCount = listeners?.length
  const shouldRun = !queue.length && listenersCount

  if (listenersCount) {
    for (let i = 0; i < listenersCount; i++) {
      queue.push(
        listeners[i],
        value,
        prevValue
      )
    }
  }

  if (shouldRun) {
    for (queueIndex = 0; queueIndex < queue.length; queueIndex += QUEUE_PACKET_SIZE) {
      (queue[queueIndex] as EventListener)(queue[queueIndex + 1], queue[queueIndex + 2])
    }

    queue.length = 0
  }
}
