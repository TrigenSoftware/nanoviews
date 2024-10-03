import type {
  Store,
  MapStore,
  CollectionValueStore
} from './types/index.js'
import {
  collection,
  update,
  accessKey,
  assignKey,
  toStore,
  atom
} from './internals/index.js'

/**
 * Create a map collection store.
 * @param source - Initial value of the store or source store.
 * @param itemType - Function to create a store for each item.
 * @returns A map collection store.
 */
export function map<
  K extends PropertyKey,
  V,
  S extends Record<K, V> | Store<Record<K, V>> = Store<Record<K, V>>,
  I extends CollectionValueStore<S> = CollectionValueStore<S>
>(
  source?: S,
  itemType?: ($store: CollectionValueStore<S>) => I
) {
  return collection(
    toStore(source || {}, atom),
    accessKey,
    assignKey,
    itemType
  ) as unknown as MapStore<S, I>
}

/**
 * Get value by key from the map store.
 * @param $map - The map store.
 * @param key - The key to get.
 * @returns The value.
 */
export function getKey<K extends PropertyKey, V>($map: Store<Record<K, V>>, key: K) {
  return $map.get()[key]
}

/**
 * Set value by key to the map store.
 * @param $map - The map store.
 * @param key - The key to set.
 * @param value - The value to set.
 * @returns The value.
 */
export function setKey<K extends PropertyKey, V>($map: Store<Record<K, V>>, key: K, value: V) {
  update($map, state => assignKey(state, key, value))
  return value
}

/**
 * Delete item by key from the map store.
 * @param $map - The map store.
 * @param key - The key to delete.
 * @returns The value.
 */
export function deleteKey<K extends PropertyKey, V>($map: Store<Record<K, V>>, key: K) {
  let result

  update($map, (state) => {
    let nextState

    ;({ [key]: result, ...nextState } = state)

    return nextState as Record<K, V>
  })

  return result
}

/**
 * Clear the map store.
 * @param $map - The map store.
 * @returns The cleared map store.
 */
export function clearMap<K extends PropertyKey, V>($map: Store<Record<K, V>>) {
  $map.set({} as Record<K, V>)
  return $map
}

/**
 * Check if the map store has the key.
 * @param $map - The map store.
 * @param key - The key to check.
 * @returns Whether the map store has the key.
 */
export function has<K extends PropertyKey, V>($map: Store<Record<K, V>>, key: K) {
  return key in $map.get()
}
