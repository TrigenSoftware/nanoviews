import type {
  AnyWritableSignal,
  AnyReadableSignal,
  AnySignal,
  WritableSignal
} from 'agera'

export type RateLimiter = <T extends unknown[]>(fn: (...args: T) => void) => (...args: T) => void

export type ToSignal<T> = [T] extends [AnyWritableSignal]
  ? T
  : [T] extends [AnyReadableSignal]
    ? T
    : WritableSignal<Exclude<T, AnySignal>> | Extract<T, AnySignal>
