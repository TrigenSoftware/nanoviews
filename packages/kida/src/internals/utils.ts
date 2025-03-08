import type {
  AnyFn,
  AnyObject,
  EmptyValue,
  PickNonEmptyValue
} from './types/index.js'

/**
 * Set value by index
 * @param array
 * @param index
 * @param value
 * @returns Array copy with value set
 */
export function assignIndex<T>(
  array: T[],
  index: number,
  value: T
) {
  const copy = array.slice()

  copy[index] = value

  return copy
}

/**
 * Assign key to object
 * @param object
 * @param key
 * @param value
 * @returns Object with key assigned
 */
export function assignKey<
  T extends AnyObject,
  K extends PropertyKey,
  V
>(
  object: T | EmptyValue,
  key: K,
  value: V
) {
  return {
    ...object || {},
    [key]: value
  } as PickNonEmptyValue<T> & Record<K, V>
}

/**
 * Check if value is function
 * @param value
 * @returns True if value is function
 */
export function isFunction(value: unknown): value is AnyFn {
  return typeof value === 'function'
}
