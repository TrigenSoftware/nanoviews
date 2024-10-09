import type {
  AnyFn,
  AnyObject,
  Store,
  EmptyValue
} from '@nanoviews/stores'

export type {
  AnyFn,
  AnyObject,
  EmptyValue
}

export type FalsyValue = EmptyValue | false | '' | 0

export type NestedMaybeEmptyItem<T> = T | EmptyValue | NestedMaybeEmptyItem<T>[]

export type Primitive = string | number | boolean | EmptyValue

/**
 * Extract non-empty value type
 */
export type NonEmptyValue<T> = T extends EmptyValue ? never : T

export type ValueOrStore<T> = T | Store<T>

export type StoresObject<T> = {
  [K in keyof T]?: NonEmptyValue<T[K]> extends AnyFn
    ? T[K]
    : ValueOrStore<T[K]>
}

export type TruthyStore<T> = T extends Store<infer U>
  ? U extends FalsyValue
    ? never
    : T
  : never

export type TruthyValueOrStore<T> = T extends Store<infer U>
  ? U extends FalsyValue
    ? never
    : T
  : T extends FalsyValue
    ? never
    : T

export type FalsyStore<T> = T extends Store<infer U>
  ? U extends FalsyValue
    ? T
    : never
  : never

export type FalsyValueOrStore<T> = T extends Store<infer U>
  ? U extends FalsyValue
    ? T
    : never
  : T extends FalsyValue
    ? T
    : never

export type IsReadonlyArray = (array: unknown) => array is readonly unknown[]
