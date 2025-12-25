import type { WritableSignal } from 'agera'

export const $$insert = Symbol()
export const $$clear = Symbol()
export const $$deleted = Symbol()

export type SignalsMapEvent = typeof $$insert | typeof $$clear

export interface SignalsMapEvents {
  [$$insert]?: WritableSignal<number>
  [$$clear]?: WritableSignal<number>
}

export interface SignalsMap<K, V> extends SignalsMapEvents, Map<
  K,
  WritableSignal<V | undefined> | undefined
> {}
