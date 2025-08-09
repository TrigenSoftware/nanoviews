import {
  type WritableSignal,
  type ReadableSignal,
  type Accessor,
  computed,
  morph,
  $$get,
  $$set
} from 'agera'
import type { AnyObject } from './types/index.js'
import { toAccessor } from './utils.js'

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
  key: K | Accessor<K>,
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
  $parent: Accessor<P>,
  key: K | Accessor<K>,
  setValue: (parentValue: P, key: K, value: V) => P
): ReadableSignal<V>

export function child<
  P extends AnyObject,
  K extends keyof P,
  V extends P[K]
>(
  $parent: WritableSignal<P> | Accessor<P>,
  key: K | Accessor<K>,
  setValue: (parentValue: P, key: K, value: V) => P
) {
  const getKey = toAccessor(key)
  const get = computed(() => $parent()[getKey()])
  const set = (value: V) => $parent(setValue($parent(), getKey(), value))

  return morph(get, {
    [$$get]: get,
    [$$set]: set
  })
}
