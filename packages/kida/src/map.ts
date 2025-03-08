/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  type WritableSignal,
  type ReadableSignal,
  update
} from 'agera'
import {
  type AnyCollection,
  at,
  assignKey
} from './internals/index.js'

/**
 * Get writable item signal by key from the map signal.
 * @param $map - The map signal.
 * @param key - The key to get.
 * @returns The writable item signal by the key.
 */
export function atKey<T extends AnyCollection>(
  $map: WritableSignal<T>,
  key: keyof T | ReadableSignal<keyof T>
): WritableSignal<T[keyof T]>

/**
 * Get readable item signal by key from the map signal.
 * @param $map - The map signal.
 * @param key - The key to get.
 * @returns The readable item signal by the key.
 */
export function atKey<T extends AnyCollection>(
  $map: ReadableSignal<T>,
  key: keyof T | ReadableSignal<keyof T>
): ReadableSignal<T[keyof T]>

export function atKey<T extends AnyCollection>(
  $map: ReadableSignal<T> | WritableSignal<T>,
  key: keyof T | ReadableSignal<keyof T>
) {
  return at($map, assignKey, key)
}

/**
 * Get value by key from the map signal.
 * @param $map - The map signal.
 * @param key - The key to get.
 * @returns The value.
 */
export function getKey<T extends AnyCollection>($map: ReadableSignal<T>, key: keyof T) {
  return $map()[key]
}

/**
 * Set value by key to the map signal.
 * @param $map - The map signal.
 * @param key - The key to set.
 * @param value - The value to set.
 * @returns The value.
 */
export function setKey<T extends AnyCollection>($map: WritableSignal<T>, key: keyof T, value: T[keyof T]) {
  update($map, state => assignKey(state, key, value))
  return value
}

/**
 * Delete item by key from the map signal.
 * @param $map - The map signal.
 * @param key - The key to delete.
 * @returns The value.
 */
export function deleteKey<T extends AnyCollection>($map: WritableSignal<T>, key: keyof T) {
  let result

  update($map, (state) => {
    let nextState

    ;({ [key]: result, ...nextState } = state)

    return nextState as T
  })

  return result as T[keyof T]
}

/**
 * Clear the map signal.
 * @param $map - The map signal.
 * @returns The cleared map signal.
 */
export function clearMap<T extends AnyCollection>($map: WritableSignal<T>) {
  $map({} as T)
  return $map
}

/**
 * Check if the map signal has the key.
 * @param $map - The map signal.
 * @param key - The key to check.
 * @returns Whether the map signal has the key.
 */
export function has<T extends AnyCollection>($map: ReadableSignal<T>, key: keyof T) {
  return key in $map()
}
