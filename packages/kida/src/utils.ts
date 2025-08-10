import {
  type Accessor,
  isFunction,
  computed
} from 'agera'
import type { RateLimiter } from './types/index.js'

export * from './internals/utils.js'

/**
 * Create a signal for the length property of an object.
 * @param $signal - Store to get the length from.
 * @returns The mapped signal for the length.
 */
export function length<T extends { length: number }>($signal: Accessor<T>) {
  return computed(() => $signal().length)
}

/**
 * Create a signal for the boolean value of a signal.
 * @param $signal - Store to convert to a boolean.
 * @returns The mapped signal for the boolean value.
 */
export function boolean<T>($signal: Accessor<T>) {
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

/* @__NO_SIDE_EFFECTS__ */
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

/* @__NO_SIDE_EFFECTS__ */
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
