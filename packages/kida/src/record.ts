import type {
  AnyReadableSignal,
  AnyWritableSignal,
  WritableSignal
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
import { toSignal } from './utils.js'

const flatHandler = /* @__PURE__ */ createProxyHandler(child => child)

/**
 * Create a record signal from an object or signal with object.
 * The signal will have the same keys for property signals as the source object.
 * @param source - Source signal.
 * @returns A record signal.
 */
export function record<T>(source: T) {
  return recordBase(toSignal(source), flatHandler) as T extends AnyWritableSignal
    ? WritableRecord<T>
    : T extends AnyReadableSignal
      ? ReadableRecord<T>
      : WritableRecord<WritableSignal<T>>
}

const deepHandler = /* @__PURE__ */ createProxyHandler(deepRecord)

/**
 * Create a record signal from an deep object or signal with deep object.
 * The signal will have the same keys for property signals as the source object recursively.
 * @param source - Source signal.
 * @returns A deep record signal.
 */
export function deepRecord<T>(source: T) {
  return recordBase(toSignal(source), deepHandler) as T extends AnyWritableSignal
    ? WritableDeepRecord<T>
    : T extends AnyReadableSignal
      ? ReadableDeepRecord<T>
      : WritableDeepRecord<WritableSignal<T>>
}
