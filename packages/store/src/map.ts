import {
  type WritableSignal,
  type NewValue,
  signal
} from 'kida'

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

export function subMapEvent(map: SignalsMapEvents, event: SignalsMapEvent) {
  (map[event] ??= signal(0))()
}

export function fireMapEvent(map: SignalsMapEvents, event: SignalsMapEvent) {
  map[event]?.(x => x + 1)
}

/**
 * Get value by key from the signals map.
 * @param map - The signals map.
 * @param key - The key to get.
 * @returns The value.
 */
export function $getMapKey<
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
