import {
  type Runner,
  isSignal,
  computed
} from 'kida'
import type { ValueOrSignal } from './internals/index.js'

export * from './internals/utils.js'

/**
 * Helper to throw error in expression
 * @param error - Error to throw
 */
export function throw$(error: Error) {
  throw error
}

/**
 * Create a class name string from parts
 * @param parts - Class name parts
 * @returns Class name string
 */
export function className(...parts: unknown[]) {
  const len = parts.length
  let cls = ''

  if (len) {
    for (let i = 0, part: unknown; i < len; i++) {
      if ((part = parts[i]) && typeof part === 'string') {
        cls += (cls && ' ') + part
      }
    }
  }

  return cls
}

/**
 * Create computed store with get function that can handle signals and bare values
 * @param compute - Computed function
 * @param runner
 * @returns Computed store
 */
export function computed$<T>(
  compute: (get: <V>(valueOrSignal: ValueOrSignal<V>) => V) => T,
  runner?: Runner
) {
  return computed(
    get => compute(valueOrSignal => (isSignal(valueOrSignal) ? get(valueOrSignal) : valueOrSignal)),
    runner
  )
}
