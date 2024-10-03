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

export type ToStore<T> = Exclude<T, AnyStore> extends never
  ? T
  : Store<Exclude<T, AnyStore>> | Extract<T, AnyStore>

export type StoresValues<T> = T extends [infer F, ...infer R]
  ? [StoreValue<F>, ...StoresValues<R>]
  : []

export type MaybeStoresValues<T> = T extends [infer F, ...infer R]
  ? [MaybeStoreValue<F>, ...MaybeStoresValues<R>]
  : []

export type StoresValuesOrUndefined<T> = T extends [infer F, ...infer R]
  ? [StoreValue<F> | undefined, ...StoresValuesOrUndefined<R>]
  : []

export type MaybeStoresValuesOrUndefined<T> = T extends [infer F, ...infer R]
  ? [MaybeStoreValue<F> | undefined, ...MaybeStoresValuesOrUndefined<R>]
  : []

export type AnyDependency = AnyStore | AnyStore[]
