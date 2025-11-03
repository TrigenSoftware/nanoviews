import {
  type Accessor,
  isFunction,
  computed,
  untracked
} from 'agera'
import type {
  AnyFn,
  RateLimiter,
  ValueOrAccessor
} from './types/index.js'
import { get } from './internals/utils.js'

export * from './internals/utils.js'

/**
 * Define an action to escape tracking within a function.
 * @param fn - Function to wrap as an action.
 * @returns The action function.
 */
/* @__NO_SIDE_EFFECTS__ */
export function action<T extends AnyFn>(fn: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return ((...args: unknown[]) => untracked(() => fn(...args))) as T
}

/**
 * Create a signal for the length property of an object.
 * @param $signal - Store to get the length from.
 * @returns The mapped signal for the length.
 */
/* @__NO_SIDE_EFFECTS__ */
export function length<T extends { length: number }>($signal: Accessor<T>) {
  return computed(() => $signal().length)
}

/**
 * Create a signal for the boolean value of a signal.
 * @param $signal - Store to convert to a boolean.
 * @returns The mapped signal for the boolean value.
 */
/* @__NO_SIDE_EFFECTS__ */
export function boolean<T>($signal: Accessor<T>) {
  return computed(() => Boolean($signal()))
}

/**
 * Concatenate multiple values or accessors into a single string.
 * @param parts - Values or accessors to concatenate.
 * @returns A computed signal that returns the concatenated string.
 */
/* @__NO_SIDE_EFFECTS__ */
export function concat(...parts: ValueOrAccessor<unknown>[]) {
  return computed(() => parts.map(get).join(''))
}

/**
 * Create a signal that tracks the previous value of another signal.
 * @param $signal - Store to track the previous value of.
 * @returns A signal that returns the previous value, or undefined if there is none.
 */
/* @__NO_SIDE_EFFECTS__ */
export function previous<T>($signal: Accessor<T>): Accessor<T | undefined> {
  let prev: T | undefined

  return computed(() => {
    const result = prev

    prev = $signal()

    return result
  })
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
