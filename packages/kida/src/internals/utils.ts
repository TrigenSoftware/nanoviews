import {
  signal,
  isSignal,
  isAccessor,
  computed
} from 'agera'
import type {
  AnyObject,
  EmptyValue,
  PickNonEmptyValue,
  ToAccessor,
  ToSignal,
  ValueOrAccessor
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
 * Get value from signal or return value
 * @param valueOr$signal - Value or signal
 * @returns Value
 */
/* @__NO_SIDE_EFFECTS__ */
export function get<T>(valueOr$signal: ValueOrAccessor<T>): T {
  return isAccessor(valueOr$signal) ? valueOr$signal() : valueOr$signal
}

/**
 * Create signal from value or return signal
 * @param valueOrSignal - Value or signal
 * @returns Writable signal
 */
export function toSignal<T>(
  valueOrSignal: T
): ToSignal<T>

export function toSignal(valueOrSignal: unknown) {
  return isSignal(valueOrSignal)
    ? valueOrSignal
    : isAccessor(valueOrSignal)
      ? computed(valueOrSignal)
      : signal(valueOrSignal)
}

/**
 * Create accessor from value or return accessor
 * @param valueOrAccessor - Value or accessor
 * @returns Accessor
 */
export function toAccessor<T>(
  valueOrAccessor: T
): ToAccessor<T>

export function toAccessor(valueOrReadable: unknown) {
  return isAccessor(valueOrReadable)
    ? valueOrReadable
    : () => valueOrReadable
}

/**
 * Create signal from value or return accessor or signal
 * @param valueOrAccessor - Value or accessor or signal
 * @returns Accessor or signal
 */
export function toAccessorOrSignal<T>(
  valueOrAccessor: T
): ToAccessor<T>

export function toAccessorOrSignal(valueOrReadable: unknown) {
  return isAccessor(valueOrReadable)
    ? valueOrReadable
    : signal(valueOrReadable)
}
