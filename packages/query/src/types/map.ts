import type {
  SignalsMapEvents,
  SignalsMap
} from 'kida'

export interface ShardKey<S> {
  shard: S
  key?: undefined
}

export interface ShardedKey<S, K> {
  shard: S
  key: K
}

export interface ShardedSignalsMap<S, K, T> extends SignalsMapEvents, Map<
  S,
  SignalsMap<K, T>
> {}
