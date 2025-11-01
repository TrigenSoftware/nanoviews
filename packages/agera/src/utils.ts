import {
  type AnyReadableSignal,
  type AnyAccessor,
  type AnyFn,
  $$signal
} from './internals/index.js'

/**
 * Check if the value is an signal.
 * @param value
 * @returns Whether the value is an signal.
 */
export function isSignal<T extends AnyReadableSignal = AnyReadableSignal>(value: unknown): value is T {
  return typeof value === 'function' && $$signal in value
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
