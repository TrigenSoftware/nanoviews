import type {
  AnySignal,
  ReadableSignal,
  WritableSignal
} from 'agera'
import type {
  AnyObject,
  CollectionKey,
  CollectionStore
} from './types/index.js'
import { $$collection } from './symbols.js'
import { onMount } from './lifecycle.js'
import { child } from './child.js'

/**
 * Get item signal from collection signal.
 * @param $collection - Writable collection signal.
 * @param set - Function to set item value.
 * @param key - Key of the item.
 * @returns Writable item signal.
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
 * Get item signal from collection signal.
 * @param $collection - Readable collection signal.
 * @param set - Function to set item value.
 * @param key - Key of the item.
 * @returns Readable item signal.
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

  if (cache === undefined) {
    $collection[$$collection] = cache = new Map()

    onMount($collection, () => () => cache!.clear())
  }

  let $item = cache.get(key)

  if (!$item) {
    cache.set(key, $item = child(
      $collection,
      key,
      set
    ))
    onMount($item, () => () => cache!.delete(key))
  }

  return $item
}
