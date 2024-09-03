import type {
  Store,
  AnyStore,
  AnyCollection,
  AnyCollectionStore
} from './types/index.js'
import { onStop } from './lifecycle.js'
import { child } from './child.js'

/**
 * Create a store for a collection.
 * @param $source - The source store.
 * @param set - Function to immutably set a value in the collection.
 * @param itemType - Function to create a store for each item.
 * @returns A store for the collection.
 */
export function collection(
  $source: Store<AnyCollection>,
  set: (state: AnyCollection, key: PropertyKey, value: unknown) => AnyCollection,
  itemType: ($store: AnyStore) => AnyStore = _ => _
) {
  const cache = new Map<PropertyKey, AnyStore>()
  const $collection: AnyCollectionStore = {
    ...$source,
    at(key: PropertyKey) {
      let item = cache.get(key)

      if (!item) {
        item = itemType(child(
          $collection,
          $collection,
          state => state![key],
          (state, value) => set(state!, key, value)
        ))

        cache.set(key, item)
        onStop(item, () => cache.delete(key))
      }

      return item
    }
  }

  return $collection
}
