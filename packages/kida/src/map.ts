import { signal, type NewValue } from 'agera'
import {
  type SignalsMap,
  $$insert,
  $$clear,
  $$deleted,
  subMapEvent,
  fireMapEvent
} from './internals/index.js'

export {
  $$clear,
  $$deleted,
  $$insert,
  subMapEvent,
  fireMapEvent
} from './internals/index.js'

/**
 * Get value by key from the signals map.
 * @param map - The signals map.
 * @param key - The key to get.
 * @returns The value.
 */
export function getMapKey<
  K,
  V
>(
  map: SignalsMap<K, V>,
  key: K
) {
  const $signal = map.get(key)

  if ($signal === undefined) {
    subMapEvent(map, $$insert)
    return undefined
  }

  subMapEvent(map, $$clear)

  return $signal()
}

/**
 * Set value by key to the signals map.
 * @param map - The signals map.
 * @param key - The key to set.
 * @param value - The value to set.
 */
export function setMapKey<
  K,
  V
>(
  map: SignalsMap<K, V>,
  key: K,
  value: NewValue<V | undefined>
) {
  let $item = map.get(key)
  const insert = $item === undefined

  if (insert) {
    map.set(key, $item = signal())
  }

  $item!(value)

  if (insert) {
    fireMapEvent(map, $$insert)
  }
}

/**
 * Clear the signals map.
 * @param map - The signals map.
 */
export function clearMap<
  K,
  V
>(
  map: SignalsMap<K, V>
) {
  map.clear()
  fireMapEvent(map, $$clear)
}

/**
 * Delete item by key from the signals map.
 * @param map - The signals map.
 * @param key - The key to delete.
 */
export function deleteMapKey<
  K,
  V
>(
  map: SignalsMap<K, V>,
  key: K
) {
  const $item = map.get(key)

  if ($item !== undefined) {
    map.delete(key)
    $item($$deleted as V)
  }
}
