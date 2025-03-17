import type {
  AnyFn,
  AnyObject,
  ReadableSignal,
  WritableSignal,
  EmptyValue,
  Destroy,
  MaybeDestroy,
  EffectCallback
} from 'kida'

export type {
  EffectCallback,
  Destroy,
  MaybeDestroy,
  AnyFn,
  AnyObject,
  EmptyValue
}

export type FalsyValue = EmptyValue | false | '' | 0

export type Primitive = string | number | boolean | EmptyValue

/**
 * Extract non-empty value type
 */
export type NonEmptyValue<T> = T extends EmptyValue ? never : T

export type ValueOrSignal<T> = T | ReadableSignal<T>

export type ValueOrWritableSignal<T> = T | WritableSignal<T>

export type Props<T, E extends string = never> = {
  [K in keyof T]?: K extends E
    ? T[K]
    : NonEmptyValue<T[K]> extends AnyFn
      ? T[K]
      : ValueOrSignal<T[K]>
}

export type TruthySignal<T> = T extends ReadableSignal<infer U>
  ? U extends FalsyValue
    ? never
    : T
  : never

export type TruthyValueOrSignal<T> = T extends ReadableSignal<infer U>
  ? U extends FalsyValue
    ? never
    : T
  : T extends FalsyValue
    ? never
    : T

export type FalsySignal<T> = T extends ReadableSignal<infer U>
  ? U extends FalsyValue
    ? T
    : never
  : never

export type FalsyValueOrSignal<T> = T extends ReadableSignal<infer U>
  ? U extends FalsyValue
    ? T
    : never
  : T extends FalsyValue
    ? T
    : never
