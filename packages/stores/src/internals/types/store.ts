import type { EventTarget } from '../events/index.js'

export const LevelSymbol = Symbol()

export interface Store<T> extends EventTarget {
  [LevelSymbol]: number
  /**
   * Get store value.
   */
  get(): T
  /**
   * Set store value.
   * @param value - New value.
   */
  set(value: T): void
}

export type AnyStore = Store<any>

export type StoreValue<T> = T extends Store<infer U> ? U : never

export type MaybeStoreValue<T> = T extends Store<infer U> ? U : T

export type ToStore<T> = T extends AnyStore ? T : Store<T>

export type StoresValues<T> = T extends [infer F, ...infer R]
  ? [StoreValue<F>, ...StoresValues<R>]
  : []
