import type {
  AnyStore,
  Store,
  MaybeStoreValue,
  ToStore
} from './store.js'

export type AnyList = any[]

export type AnyMap = Record<PropertyKey, any>

export type Collection<K extends PropertyKey, V> = Record<K, V> | V[]

export type AnyCollection = AnyList | AnyMap

export type CollectionKey<C extends AnyCollection> = C extends AnyList
  ? number
  : C extends Record<infer K, any>
    ? K
    : never

export type CollectionValue<C extends AnyCollection> = C extends Collection<PropertyKey, infer V>
  ? V
  : never

export type AnyCollectionStore = Store<AnyCollection> & {
  at(key: PropertyKey | Store<PropertyKey>): AnyStore
}

export type CollectionStoreKey<T extends AnyCollection | Store<AnyCollection>> = CollectionKey<MaybeStoreValue<T>>

export type CollectionValueStore<T extends AnyCollection | Store<AnyCollection>> = Store<CollectionValue<MaybeStoreValue<T>> | undefined>

export type CollectionStore<
  T extends AnyCollection | Store<AnyCollection>,
  I extends CollectionValueStore<T>
> = ToStore<T> & {
  /**
   * Get element store by key.
   * @param key
   * @returns Element store.
   */
  at(key: CollectionStoreKey<T> | Store<CollectionStoreKey<T>>): I
}
