import {
  type AnySignal,
  type EffectCallback,
  effect,
  effectScope
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
 * Run effect scope on signal mount.
 * @param $signal - The signal to listen mount.
 * @param fn - The effect scope function.
 * @returns Function to stop listening.
 */
export function onMountEffectScope($signal: AnySignal, fn: () => void) {
  return onMount($signal, () => effectScope(fn))
}
