import type { NewValue } from 'kida'
import type {
  ShardedSignalsMap,
  ShardKey,
  ShardedKey
} from './map.js'

export interface CacheEntry<T = unknown> {
  rev: number
  dedupes: number
  expires: number
  data: T | null
  error: string | null
  loading: boolean
}

export type CacheMap = ShardedSignalsMap<string, string, CacheEntry>

export interface CacheShardKey<
  P extends unknown[] = unknown[],
  R = unknown
> extends ShardKey<string> {
  // Only types info:
  P: P
  R: R
}

export interface CacheKey<
  P extends unknown[] = unknown[],
  R = unknown
> extends ShardedKey<string, string> {
  // Only types info:
  P: P
  R: R
}

export interface ExtrasCacheKey<
  P extends unknown[] = unknown[],
  E extends unknown[] = unknown[],
  R = unknown
> extends CacheKey<P, R> {
  // Only types info:
  E: E
}

export type CacheKeyBuilder<P extends unknown[], R> = (
  (...params: Partial<P>) => CacheKey<P, R>
) & CacheShardKey<P, R>

export type ExtrasCacheKeyBuilder<
  P extends unknown[],
  E extends unknown[],
  R
> = (
  (...params: Partial<P>) => ExtrasCacheKey<P, E, R>
) & CacheShardKey<P, R>

export interface CacheDataFacade {
  <P extends unknown[], R>(key: CacheKey<P, R>): R | null
  <P extends unknown[], R>(key: CacheShardKey<P, R> | CacheKey<P, R>, value: NewValue<R | null>): void
}
