import {
  type WritableSignal,
  type ReadableSignal,
  isSignal,
  computed,
  morph,
  $$get,
  $$set
} from 'agera'
import type { AnyObject } from './types/index.js'

/**
 * Create a writable child signal from a parent signal.
 * @param $parent - Parent signal.
 * @param key - Static or signal key to get from the parent.
 * @param setValue - Function to set the value in the parent.
 * @returns A writable child signal.
 */
export function child<
  P extends AnyObject,
  K extends keyof P,
  V extends P[K]
>(
  $parent: WritableSignal<P>,
  key: K | ReadableSignal<K>,
  setValue: (parentValue: P, key: K, value: V) => P
): WritableSignal<V>

/**
 * Create a readable child signal from a parent signal.
 * @param $parent - Parent signal.
 * @param key - Static or signal key to get from the parent.
 * @param setValue - Function to set the value in the parent.
 * @returns A readable child signal.
 */
export function child<
  P extends AnyObject,
  K extends keyof P,
  V extends P[K]
>(
  $parent: ReadableSignal<P>,
  key: K | ReadableSignal<K>,
  setValue: (parentValue: P, key: K, value: V) => P
): ReadableSignal<V>

export function child<
  P extends AnyObject,
  K extends keyof P,
  V extends P[K]
>(
  $parent: WritableSignal<P> | ReadableSignal<P>,
  key: K | ReadableSignal<K>,
  setValue: (parentValue: P, key: K, value: V) => P
) {
  const isSignalKey = isSignal(key)
  const get = computed(
    isSignalKey
      ? () => $parent()[key()]
      : () => $parent()[key]
  )
  const set = isSignalKey
    ? (value: V) => $parent(setValue($parent(), key(), value))
    : (value: V) => $parent(setValue($parent(), key, value))

  return morph(get, {
    [$$get]: get,
    [$$set]: set
  })
}
