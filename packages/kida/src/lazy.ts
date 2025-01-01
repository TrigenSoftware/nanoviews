import {
  type WritableSignal,
  Lazy
} from './internals/index.js'

/**
 * Create a store that is lazily initialized.
 * @param factory - The factory function.
 * @returns The lazy store.
 */
export function lazy<T>(factory: () => T): WritableSignal<T> {
  return new Lazy(factory)
}
