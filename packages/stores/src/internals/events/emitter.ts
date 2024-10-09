import type {
  EventTarget,
  EventName,
  EventHandler
} from './types.js'
import { EventTargetSymbol } from './types.js'

/**
 * Add an event listener to the target.
 * @param target
 * @param event
 * @param handler
 * @param level - Priority level of the event listener.
 * @param onFirstListener - Callback to be called when the first listener is added.
 * @returns A function to remove the event listener.
 */
export function on(
  target: EventTarget,
  event: EventName,
  handler: EventHandler,
  level = 0,
  onFirstListener?: () => void
) {
  const targetMap = target[EventTargetSymbol]
  const handlers = (targetMap.get(event) || targetMap.set(event, []).get(event))!
  const isFirstListener = !handlers.length
  const off = () => {
    const index = handlers.indexOf(handler)
    let wasLastListener = false

    if (~index) {
      handlers.splice(index, 2)
      wasLastListener = !handlers.length
    }

    if (wasLastListener) {
      targetMap.delete(event)
    }

    return wasLastListener
  }

  handlers.push(handler, level)

  if (isFirstListener && onFirstListener) {
    onFirstListener()
  }

  return off
}

const QUEUE_PACKET_SIZE = 3
const queue: (EventHandler | number | unknown[])[] = []

/**
 * Dispatch an event to the target.
 * @param target
 * @param event
 * @param args
 * @returns Whether the event was not aborted.
 */
export function dispatch(target: EventTarget, event: EventName, args: unknown[] = []) {
  const handlers = target[EventTargetSymbol]?.get(event)
  let result = true

  if (handlers) {
    const shouldRun = !queue.length

    for (let i = 0; i < handlers.length; i += 2) {
      queue.push(
        handlers[i],
        handlers[i + 1],
        args
      )
    }

    if (shouldRun) {
      const abort = () => {
        result = false
      }
      const shared = {}

      for (let i = 0; i < queue.length; i += QUEUE_PACKET_SIZE) {
        let skip

        for (let j = i + 1; !skip && (j += QUEUE_PACKET_SIZE) < queue.length;) {
          if (queue[j] < queue[i + 1]) {
            skip = queue.push(
              queue[i],
              queue[i + 1],
              queue[i + 2]
            )
          }
        }

        if (!skip) {
          (queue[i] as EventHandler)(...queue[i + 2] as unknown[], abort, shared)
        }
      }

      queue.length = 0
    }
  }

  return result
}
