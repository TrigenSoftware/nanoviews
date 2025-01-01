import {
  type ReadableSignal,
  mapped
} from './internals/index.js'

export * from './internals/utils.js'

/**
 * Create a mapped store for the length property of an object.
 * @param $signal - Store to get the length from.
 * @returns The mapped store for the length.
 */
export function length$<T extends { length: number }>($signal: ReadableSignal<T>) {
  return mapped($signal, state => state.length)
}

/**
 * Create a mapped store for the boolean value of a store.
 * @param $signal - Store to convert to a boolean.
 * @returns The mapped store for the boolean value.
 */
export function boolean$<T>($signal: ReadableSignal<T>) {
  return mapped($signal, Boolean)
}
