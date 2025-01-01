import type {
  AnyFn,
  AnyObject,
  EmptyValue,
  PickNonEmptyValue,
  AnyReadableSignal,
  AnyWritableSignal,
  WritableSignal
} from './types/index.js'
import {
  isSignal,
  signal
} from './signal.js'

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

/**
 * Create store from value or return store
 * @param valueOrSignal - Value or store
 * @returns Store
 */
export function toSignal<T>(
  valueOrSignal: T
): T extends AnyWritableSignal
  ? T
  : T extends AnyReadableSignal
    ? T
    : WritableSignal<T>

export function toSignal(valueOrSignal: unknown) {
  if (isSignal(valueOrSignal)) {
    return valueOrSignal
  }

  return signal(valueOrSignal)
}

/**
 * Memoize mapping function
 * @param fn - Mapping function
 * @returns Memoized mapping function
 */
export function memo<T, R>(fn: (input: T) => R) {
  let prevInput: T
  let prevResult: R

  return (input: T) => (
    input === prevInput
      ? prevResult
      : prevResult = fn(prevInput = input)
  )
}

export const noop = () => {}
