/**
 * Empty value type
 */
export type EmptyValue = undefined | null | void

export type NestedMaybeEmptyItem<T> = T | EmptyValue | NestedMaybeEmptyItem<T>[]

export type Primitive = string | number | boolean | EmptyValue

/**
 * Extract non-empty value type
 */
export type NonEmptyValue<T> = T extends EmptyValue ? never : T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFn = (...args: any) => any

export type ReadonlyIfObject<Value> = Value extends Primitive
  ? Value
  : Value extends AnyFn
    ? Value
    : Value extends object
      ? Readonly<Value>
      : Value

/**
 * Store interface
 */
export interface Store<T = unknown> {
  get(): T
  set(value: T): void
  listen(callback: (value: ReadonlyIfObject<T>, prevValue: ReadonlyIfObject<T> | undefined) => void): () => void
}

export type ValueOrStore<T> = T | Store<T>

export type StoresObject<T> = {
  [K in keyof T]?: NonEmptyValue<T[K]> extends AnyFn
    ? T[K]
    : ValueOrStore<T[K]>
}
