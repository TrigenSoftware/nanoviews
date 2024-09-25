import type { Store } from './internals/index.js'
import { computed } from './internals/index.js'

export * from './internals/utils.js'

/**
 * Create a computed store for the length property of an object.
 * @param $store - Store to get the length from.
 * @returns The computed store for the length.
 */
export function length$<T extends { length: number }>($store: Store<T>) {
  return computed($store, state => state.length)
}

/**
 * Create a computed store for the boolean value of a store.
 * @param store - Store to convert to a boolean.
 * @returns The computed store for the boolean value.
 */
export function boolean$<T>(store: Store<T>) {
  return computed(store, Boolean)
}
