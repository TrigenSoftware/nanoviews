import type {
  AnyAccessor,
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
  recordBase,
  toAccessorOrSignal
} from './internals/index.js'

const flatHandler = /* @__PURE__ */ createProxyHandler(child => child)

/**
 * Create a record signal from an object or signal with object.
 * The signal will have the same keys for property signals as the source object.
 * @param source - Source signal.
 * @returns A record signal.
 */
/* @__NO_SIDE_EFFECTS__ */
export function record<T>(source: T) {
  return recordBase(toAccessorOrSignal(source), flatHandler) as T extends AnyWritableSignal
    ? WritableRecord<T>
    : T extends AnyAccessor
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
/* @__NO_SIDE_EFFECTS__ */
export function deepRecord<T>(source: T) {
  return recordBase(toAccessorOrSignal(source), deepHandler) as T extends AnyWritableSignal
    ? WritableDeepRecord<T>
    : T extends AnyAccessor
      ? ReadableDeepRecord<T>
      : WritableDeepRecord<WritableSignal<T>>
}
