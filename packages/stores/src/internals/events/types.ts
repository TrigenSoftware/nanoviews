export const EventTargetSymbol = Symbol()

export interface EventTarget {
  [EventTargetSymbol]: Map<EventName, (EventHandler | number)[]>
}

export type EventName = number | symbol | string

export type EventHandler = (...args: any[]) => void
