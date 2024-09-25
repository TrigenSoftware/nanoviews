import type {
  Store,
  AnyStore,
  AnyCollection,
  AnyCollectionStore
} from './types/index.js'
import { isStore } from './utils.js'
import { onMount } from './lifecycle.js'
import { child } from './child.js'

/**
 * Create a store for a collection.
 * @param $source - The source store.
 * @param get - Function to get a value from the collection.
 * @param set - Function to immutably set a value in the collection.
 * @param itemType - Function to create a store for each item.
 * @returns A store for the collection.
 */
export function collection(
  $source: Store<AnyCollection>,
  get: (state: any, key: any) => any,
  set: (state: any, key: any, value: any) => any,
  itemType: ($store: AnyStore) => AnyStore = _ => _
) {
  const cache = new Map<PropertyKey | Store<PropertyKey>, AnyStore>()
  const $collection: AnyCollectionStore = {
    ...$source,
    at(key: PropertyKey | Store<PropertyKey>) {
      if (isStore(key)) {
        return itemType(child(
          $collection,
          $collection,
          state => get(state, key.get()),
          (state, value) => set(state, key.get(), value),
          [key]
        ))
      }

      let item = cache.get(key)

      if (!item) {
        item = itemType(child(
          $collection,
          $collection,
          state => get(state, key),
          (state, value) => set(state, key, value)
        ))

        cache.set(key, item)
        onMount(item, () => () => cache.delete(key))
      }

      return item
    }
  }

  return $collection
}
