import type { AnySignal } from 'agera'
import type {
  AnyRecordStore,
  RecordStore
} from './types/index.js'
import { $$record } from './symbols.js'
import { child } from './child.js'
import { assignKey } from './utils.js'

export function createProxyHandler(ext: ($signal: AnySignal) => AnySignal): ProxyHandler<AnyRecordStore> {
  return {
    get($signal, key: string) {
      if (!(key in $signal) && key[0] === '$') {
        return $signal[key] = ext(child(
          $signal,
          key.slice(1),
          assignKey
        ))
      }

      return $signal[key]
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
