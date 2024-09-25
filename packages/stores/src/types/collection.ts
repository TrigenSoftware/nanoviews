import type {
  Store,
  AnyList,
  AnyMap,
  CollectionStore,
  CollectionValueStore
} from '../internals/types/index.js'

export type ListStore<
  T extends AnyList | Store<AnyList>,
  I extends CollectionValueStore<T> = CollectionValueStore<T>
> = CollectionStore<T, I>

export type MapStore<
  T extends AnyMap | Store<AnyMap>,
  I extends CollectionValueStore<T> = CollectionValueStore<T>
> = CollectionStore<T, I>

export type EntitiesStore<
  T extends AnyList | Store<AnyList>,
  I extends CollectionValueStore<T> = CollectionValueStore<T>
> = CollectionStore<T, I> & {
  /**
   * Get entity store by id.
   * @param id - Entity id.
   * @returns Entity store.
   */
  byId(id: PropertyKey | Store<PropertyKey>): I
}
