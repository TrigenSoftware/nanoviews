export type EventKey = symbol

export type EventListener = (...args: any[]) => void

export interface EventTarget {
  [event: EventKey]: EventListener[]
}
