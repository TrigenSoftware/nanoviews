import {
  type WritableSignal,
  type Destroy,
  External
} from './internals/index.js'

/**
 * Create a store that is controlled by an external source.
 * @param factory - The factory function.
 * @returns The external store.
 */
export function external<T>(
  factory: (set: (value: T) => void) => () => Destroy
): WritableSignal<T> {
  return new External(factory)
}
