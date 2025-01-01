import {
  type CollectionKey,
  type WritableSignal,
  type ReadableSignal,
  at,
  update,
  assignKey
} from './internals/index.js'

/**
 * Get writable item store by key from the map store.
 * @param $map - The map store.
 * @param key - The key to get.
 * @returns The writable item store by the key.
 */
export function atKey<K extends CollectionKey, V>(
  $map: WritableSignal<Record<K, V>>,
  key: K | ReadableSignal<K>
): WritableSignal<V>

/**
 * Get readable item store by key from the map store.
 * @param $map - The map store.
 * @param key - The key to get.
 * @returns The readable item store by the key.
 */
export function atKey<K extends CollectionKey, V>(
  $map: ReadableSignal<Record<K, V>>,
  key: K | ReadableSignal<K>
): ReadableSignal<V>

export function atKey<K extends CollectionKey, V>(
  $map: ReadableSignal<Record<K, V>> | WritableSignal<Record<K, V>>,
  key: K | ReadableSignal<K>
) {
  return at($map, assignKey, key)
}

/**
 * Get value by key from the map store.
 * @param $map - The map store.
 * @param key - The key to get.
 * @returns The value.
 */
export function getKey<K extends PropertyKey, V>($map: ReadableSignal<Record<K, V>>, key: K) {
  return $map.get()[key]
}

/**
 * Set value by key to the map store.
 * @param $map - The map store.
 * @param key - The key to set.
 * @param value - The value to set.
 * @returns The value.
 */
export function setKey<K extends PropertyKey, V>($map: WritableSignal<Record<K, V>>, key: K, value: V) {
  update($map, state => assignKey(state, key, value))
  return value
}

/**
 * Delete item by key from the map store.
 * @param $map - The map store.
 * @param key - The key to delete.
 * @returns The value.
 */
export function deleteKey<K extends PropertyKey, V>($map: WritableSignal<Record<K, V>>, key: K) {
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
export function clearMap<K extends PropertyKey, V>($map: WritableSignal<Record<K, V>>) {
  $map.set({} as Record<K, V>)
  return $map
}

/**
 * Check if the map store has the key.
 * @param $map - The map store.
 * @param key - The key to check.
 * @returns Whether the map store has the key.
 */
export function has<K extends PropertyKey, V>($map: ReadableSignal<Record<K, V>>, key: K) {
  return key in $map.get()
}
