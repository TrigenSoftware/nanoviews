import { signal } from 'agera'
import type {
  SignalsMapEvents,
  SignalsMapEvent
} from './types/index.js'

export function subMapEvent(map: SignalsMapEvents, event: SignalsMapEvent) {
  (map[event] ??= signal(0))()
}

export function fireMapEvent(map: SignalsMapEvents, event: SignalsMapEvent) {
  map[event]?.(x => x + 1)
}
