import {
  type AnySignal,
  type ReadableSignal,
  type EffectCallback,
  effect
} from 'agera'
import { onMount } from './lifecycle.js'

/**
 * Run effect on signal mount.
 * @param $signal - The signal to listen mount.
 * @param fn - The effect function.
 * @returns Function to stop listening.
 */
export function onMountEffect($signal: AnySignal, fn: EffectCallback) {
  return onMount($signal, () => effect(fn))
}

/**
 * Run listener immediately and subscribes to signal changes.
 * @param $signal - The signal to subscribe to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function subscribe<T>(
  $signal: ReadableSignal<T>,
  listener: (value: T, prevValue: T | undefined) => void
) {
  let prevValue = $signal()

  listener(prevValue, undefined)

  return effect(() => {
    const value = $signal()

    if (prevValue !== value) {
      listener(value, prevValue)

      prevValue = value
    }
  })
}
