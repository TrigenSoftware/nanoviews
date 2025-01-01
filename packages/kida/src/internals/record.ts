import type {
  AnyFn,
  AnyRecordStore,
  AnySignal,
  RecordStore
} from './types/index.js'
import { $$record } from './symbols.js'
import { RecordChild } from './child.js'
import {
  assignKey,
  isFunction
} from './utils.js'

export function createProxyHandler(ext: ($signal: AnySignal) => AnySignal): ProxyHandler<AnyRecordStore> {
  return {
    get($signal, key) {
      if (!(key in $signal)) {
        if (typeof key === 'symbol') {
          return
        }

        return $signal[key] = ext(new RecordChild(
          $signal,
          key,
          assignKey
        ))
      }

      const value = $signal[key]

      // Reflect.get don't work with class private fields. No cache is faster than with cache.
      if (isFunction(value)) {
        return (value as AnyFn).bind($signal)
      }

      return value
    }
  }
}

export function recordBase(
  $source: AnySignal & RecordStore,
  handler: ProxyHandler<AnyRecordStore>
): AnyRecordStore {
  let cached = $source[$$record]

  if (!cached) {
    $source[$$record] = cached = new Proxy($source, handler) as AnyRecordStore
  }

  return cached
}
