import type {
  Store,
  AnyStore,
  AnyObject,
  EmptyValue,
  RecordStore,
  DeepRecordStore
} from './types/index.js'
import {
  atom,
  recordBase,
  toStore
} from './internals/index.js'

/**
 * Create a store for a record object. The store will have the same keys for property stores as the source object.
 * @param source - Initial value of the store or source store.
 * @returns A record store.
 */
export function record<T extends AnyObject | EmptyValue | Store<AnyObject | EmptyValue>>(
  ...source: undefined extends T ? [] | [T] : [T]
): RecordStore<T>

export function record(source?: AnyObject | EmptyValue | AnyStore) {
  return recordBase((_, $store) => $store, toStore(source, atom))
}

/**
 * Create a store for a deep record object. The store will have the same keys for property stores as the source object recursively.
 * @param source - Initial value of the store or source store.
 * @returns A deep record store.
 */
export function deepRecord<T extends AnyObject | EmptyValue | Store<AnyObject | EmptyValue>>(
  ...source: undefined extends T ? [] | [T] : [T]
): DeepRecordStore<T>

export function deepRecord(source?: AnyObject | EmptyValue | AnyStore) {
  return recordBase(recordBase, toStore(source, atom))
}
