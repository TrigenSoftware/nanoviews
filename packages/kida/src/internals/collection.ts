import type {
  AnyObject,
  AnySignal,
  ReadableSignal,
  WritableSignal,
  CollectionKey,
  CollectionStore
} from './types/index.js'
import { $$collection } from './symbols.js'
import { onMount } from './lifecycle.js'
import { CollectionChild } from './child.js'

/**
 * Get item store from collection store.
 * @param $collection - Writable collection store.
 * @param set - Function to set item value.
 * @param key - Key of the item.
 * @returns Writable item store.
 */
export function at<
  P extends AnyObject,
  K extends keyof P,
  V extends P[K]
>(
  $collection: WritableSignal<P>,
  set: (collection: P, key: K, value: V) => P,
  key: K | ReadableSignal<K>
): WritableSignal<V>

/**
 * Get item store from collection store.
 * @param $collection - Readable collection store.
 * @param set - Function to set item value.
 * @param key - Key of the item.
 * @returns Readable item store.
 */
export function at<
  P extends AnyObject,
  K extends keyof P,
  V extends P[K]
>(
  $collection: ReadableSignal<P>,
  set: (collection: P, key: K, value: V) => P,
  key: K | ReadableSignal<K>
): ReadableSignal<V>

export function at(
  $collection: AnySignal & CollectionStore,
  set: (collection: AnyObject, key: CollectionKey, value: unknown) => AnyObject,
  key: CollectionKey | ReadableSignal<CollectionKey>
) {
  let cache = $collection[$$collection]

  if (!cache) {
    $collection[$$collection] = cache = new Map()

    onMount($collection, () => () => cache!.clear())
  }

  let $item = cache.get(key)

  if (!$item) {
    cache.set(key, $item = new CollectionChild(
      $collection,
      key,
      set
    ))
    onMount($item, () => () => cache!.delete(key))
  }

  return $item
}
