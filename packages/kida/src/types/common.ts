import type {
  WritableSignal,
  ReadableSignal,
  Accessor
} from 'agera'

export type ValueOrSignal<T> = T | ReadableSignal<T>

export type ValueOrWritableSignal<T> = T | WritableSignal<T>

export type ValueOrAccessor<T> = T | Accessor<T>

export type RateLimiter = <T extends unknown[]>(fn: (...args: T) => void) => (...args: T) => void
