import type {
  ReadableSignal,
  WritableSignal,
  AnySignal,
  GenericRecordValue,
  ReadableRecord,
  WritableRecord,
  ReadableDeepRecord,
  WritableDeepRecord
} from './types/index.js'
import {
  createProxyHandler,
  recordBase
} from './internals/index.js'

const flatHandler = /* @__PURE__ */ createProxyHandler(child => child)

/**
 * Create a writable record store from a store with object.
 * The store will have the same keys for property stores as the source object.
 * @param $source - Source store.
 * @returns A writable record store.
 */
export function record<T extends WritableSignal<GenericRecordValue>>(
  $source: T
): WritableRecord<T>

/**
 * Create a readable record store from a store with object.
 * The store will have the same keys for property stores as the source object.
 * @param $source - Source store.
 * @returns A readable record store.
 */
export function record<T extends ReadableSignal<GenericRecordValue>>(
  $source: T
): ReadableRecord<T>

export function record($source: AnySignal) {
  return recordBase($source, flatHandler)
}

const deepHandler = /* @__PURE__ */ createProxyHandler(deepRecord)

/**
 * Create a writable record store from a store with deep object.
 * The store will have the same keys for property stores as the source object recursively.
 * @param $source - Source store.
 * @returns A writable deep record store.
 */
export function deepRecord<T extends WritableSignal<GenericRecordValue>>(
  $source: T
): WritableDeepRecord<T>

/**
 * Create a readable record store from a store with deep object.
 * The store will have the same keys for property stores as the source object recursively.
 * @param $source - Source store.
 * @returns A readable deep record store.
 */
export function deepRecord<T extends ReadableSignal<GenericRecordValue>>(
  $source: T
): ReadableDeepRecord<T>

export function deepRecord($source: AnySignal) {
  return recordBase($source, deepHandler)
}
