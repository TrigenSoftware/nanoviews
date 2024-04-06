import type { Store } from './internals/index.js'
import { isStore } from './internals/index.js'

export * from './internals/utils.js'

/**
 * Helper to throw error in expression
 * @param error - Error to throw
 */
export function throw$(error: Error) {
  throw error
}

/**
 * Create store from value or return store
 * @param valueOrStore - Value or store
 * @param creator - Store creator
 * @returns Store
 */
export function toStore<T, S extends Store<T>>(valueOrStore: T | Store<T>, creator: (value: T) => S): S {
  if (isStore(valueOrStore)) {
    return valueOrStore as S
  }

  return creator(valueOrStore)
}
