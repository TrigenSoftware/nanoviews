import {
  type WritableSignal,
  type AnyReadableSignal,
  type AnyWritableSignal,
  type AnyAccessor,
  type AccessorValue,
  type AnyFn,
  type ReadableSignal,
  $$signal,
  $$writable
} from './internals/index.js'

/**
 * Update the value of the signal.
 * @param $signal
 * @param fn - Function to update the value.
 * @returns The signal.
 */
export function update<T>($signal: WritableSignal<T>, fn: (value: T) => T) {
  $signal(fn($signal()))
  return $signal
}

/**
 * Check if the value is an signal.
 * @param value
 * @returns Whether the value is an signal.
 */
export function isSignal<T extends AnyReadableSignal = AnyReadableSignal>(value: unknown): value is T {
  return typeof value === 'function' && $$signal in value
}

export function isWritable<T extends AnyWritableSignal = AnyWritableSignal>(value: AnyAccessor): value is T {
  return (value as AnyWritableSignal)[$$signal]?.[$$writable] === true
}

export function readonly<T extends AnyAccessor>($signal: T) {
  if (isWritable($signal)) {
    ($signal as AnyReadableSignal)[$$signal][$$writable] = false
  }

  return $signal as T extends AnyWritableSignal ? ReadableSignal<AccessorValue<T>> : T
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
 * Check if value is accessor
 * @param value
 * @returns True if value is accessor
 */
export const isAccessor = isFunction as <T extends AnyAccessor = AnyAccessor>(value: unknown) => value is T
