import type {
  AnyReadableSignal,
  AnyWritableSignal,
  AnySignal
} from 'agera'
import type {
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
 * Create a writable record signal from a signal with object.
 * The signal will have the same keys for property stores as the source object.
 * @param $source - Source signal.
 * @returns A writable record signal.
 */
export function record<T extends AnyWritableSignal>(
  $source: T
): WritableRecord<T>

/**
 * Create a readable record signal from a signal with object.
 * The signal will have the same keys for property stores as the source object.
 * @param $source - Source signal.
 * @returns A readable record signal.
 */
export function record<T extends AnyReadableSignal>(
  $source: T
): ReadableRecord<T>

export function record($source: AnySignal) {
  return recordBase($source, flatHandler)
}

const deepHandler = /* @__PURE__ */ createProxyHandler(deepRecord)

/**
 * Create a writable record signal from a signal with deep object.
 * The signal will have the same keys for property stores as the source object recursively.
 * @param $source - Source signal.
 * @returns A writable deep record signal.
 */
export function deepRecord<T extends AnyWritableSignal>(
  $source: T
): WritableDeepRecord<T>

/**
 * Create a readable record signal from a signal with deep object.
 * The signal will have the same keys for property stores as the source object recursively.
 * @param $source - Source signal.
 * @returns A readable deep record signal.
 */
export function deepRecord<T extends AnyReadableSignal>(
  $source: T
): ReadableDeepRecord<T>

export function deepRecord($source: AnySignal) {
  return recordBase($source, deepHandler)
}
