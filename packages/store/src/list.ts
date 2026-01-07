import {
  type WritableSignal,
  type ReadableSignal,
  type Accessor,
  computed,
  atIndex
} from 'kida'

/**
 * Get writable item signal by predicate from the list signal.
 * @param $list - The list signal.
 * @param predicate - Predicate to select the item (same semantics as `Array.prototype.findIndex`).
 * @returns The writable item signal for the first matched item.
 */
export function atFoundIndex<T>(
  $list: WritableSignal<T[]>,
  predicate: (item: T, index: number, array: T[]) => boolean
): WritableSignal<T | undefined>

/**
 * Get readable item signal by predicate from the list signal.
 * @param $list - The list signal.
 * @param predicate - Predicate to select the item (same semantics as `Array.prototype.findIndex`).
 * @returns The readable item signal for the first matched item.
 */
export function atFoundIndex<T>(
  $list: Accessor<T[]>,
  predicate: (item: T, index: number, array: T[]) => boolean
): ReadableSignal<T | undefined>

/* @__NO_SIDE_EFFECTS__ */
export function atFoundIndex<T>(
  $list: Accessor<T[]> | WritableSignal<T[]>,
  predicate: (item: T, index: number, array: T[]) => boolean
): ReadableSignal<T | undefined> {
  return atIndex($list, computed(() => $list().findIndex(predicate)))
}
