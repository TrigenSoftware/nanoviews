import {
  type ReadableSignal,
  type AnyWritableSignal,
  type AnyReadableSignal,
  type WritableSignal,
  signal,
  isSignal,
  computed
} from 'agera'
import { isFunction } from './internals/index.js'
import type { RateLimiter } from './types/index.js'

export * from './internals/utils.js'

/**
 * Create a mapped signal for the length property of an object.
 * @param $signal - Store to get the length from.
 * @returns The mapped signal for the length.
 */
export function length$<T extends { length: number }>($signal: ReadableSignal<T>) {
  return computed(() => $signal().length)
}

/**
 * Create a mapped signal for the boolean value of a signal.
 * @param $signal - Store to convert to a boolean.
 * @returns The mapped signal for the boolean value.
 */
export function boolean$<T>($signal: ReadableSignal<T>) {
  return computed(() => Boolean($signal()))
}

/**
 * Create debounced function.
 * @param fn
 * @returns Debounced function.
 */
export function debounce<T extends unknown[]>(fn: (...args: T) => void): (...args: T) => void

/**
 * Create debounce function with given delay.
 * @param delay - Delay in milliseconds.
 * @returns Debounce function.
 */
export function debounce(delay?: number): RateLimiter

export function debounce(fnOrDelay?: (() => void) | number) {
  if (isFunction(fnOrDelay)) {
    return debounce()(fnOrDelay)
  }

  return (fn: (...args: unknown[]) => void) => {
    let timer: ReturnType<typeof setTimeout>

    return (...args: unknown[]) => {
      clearTimeout(timer)
      timer = setTimeout(fn, fnOrDelay, ...args)
    }
  }
}

/**
 * Create throttled function.
 * @param fn
 * @returns Throttled function.
 */
export function throttle<T extends unknown[]>(fn: (...args: T) => void): (...args: T) => void

/**
 * Create throttle function with given delay.
 * @param delay - Delay in milliseconds.
 * @returns Throttle function.
 */
export function throttle(delay?: number): RateLimiter

export function throttle(fnOrDelay?: (() => void) | number) {
  if (isFunction(fnOrDelay)) {
    return throttle()(fnOrDelay)
  }

  return (fn: (...args: unknown[]) => void) => {
    let lastArgs: unknown[] | null = null
    let lastTime = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    const delay = fnOrDelay ?? 0
    const invoke = () => {
      if (lastArgs) {
        fn(...lastArgs)
        lastArgs = null
        lastTime = Date.now()
      }

      timer = null
    }

    return (...args: unknown[]) => {
      const now = Date.now()
      const remaining = delay - (now - lastTime)

      lastArgs = args

      if (remaining <= 0 || remaining > delay) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }

        fn(...args)
        lastTime = now
        lastArgs = null
      } else
        if (!timer) {
          timer = setTimeout(invoke, remaining)
        }
    }
  }
}

/**
 * Create signal from value or return signal
 * @todo move to public API
 * @param valueOrSignal - Value or signal
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
 * Get value from signal or return value
 * @param valueOr$signal - Value or signal
 * @returns Value
 */
export function get<T>(valueOr$signal: T | ReadableSignal<T>) {
  return isSignal(valueOr$signal) ? valueOr$signal() : valueOr$signal
}
