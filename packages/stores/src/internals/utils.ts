import type {
  AnyFn,
  AnyObject,
  EmptyValue,
  PickNonEmptyValue,
  AnyStore,
  Store,
  MaybeStoreValue
} from './types/index.js'
import { LevelSymbol } from './types/index.js'

/**
 * Convert value to array
 * @param value - Value to convert
 * @returns Array value
 */
export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

/**
 * Assign key to object
 * @param object
 * @param key
 * @param value
 * @returns Object with key assigned
 */
export function assignKey<
  T,
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
 * Check if value is store
 * @param value
 * @returns True if value is store
 */
export function isStore(value: unknown): value is AnyStore {
  return !!value && LevelSymbol in (value as AnyObject)
}

/**
 * Create store from value or return store
 * @param valueOrStore - Value or store
 * @param creator - Store creator
 * @returns Store
 */
export function toStore<
  T,
  S extends Store<MaybeStoreValue<T>>
>(
  valueOrStore: T,
  creator: (value: MaybeStoreValue<T>) => S
) {
  type Result = T extends AnyStore ? T : S

  if (isStore(valueOrStore)) {
    return valueOrStore as Result
  }

  return creator(valueOrStore as MaybeStoreValue<T>) as Result
}

export const noop = () => {}
