import {
  type WritableSignal,
  type AnyReadableSignal
} from './internals/index.js'

/**
 * Update the value of the signal.
 * @param $signal
 * @param fn - Function to update the value.
 * @returns The signal.
 */
export function update<T>($signal: WritableSignal<T>, fn: (value: T) => T) {
  $signal(fn($signal()))
  return $signal
}

/**
 * Check if the value is an signal.
 * @param value
 * @returns Whether the value is an signal.
 */
export function isSignal<T extends AnyReadableSignal = AnyReadableSignal>(value: unknown): value is T {
  return typeof value === 'function'
}
