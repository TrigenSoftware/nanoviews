import type {
  AnyObject,
  EmptyValue,
  PickEmptyValue,
  PickNonEmptyValue,
  PickObjectValue,
  Store,
  MaybeStoreValue,
  ToStore
} from '../internals/types/index.js'

export type RecordStore<
  T extends AnyObject | EmptyValue | Store<AnyObject | EmptyValue>
> = [MaybeStoreValue<T>, ToStore<T>] extends [infer V, infer S]
  ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
    ? S & {
      [K in keyof Value]-?: Store<Value[K] | Empty>
    }
    : never
  : never

type ChildDeepRecord<T> = T extends AnyObject | EmptyValue
  ? DeepRecordStore<T>
  : never

export type DeepRecordStore<
  T extends AnyObject | EmptyValue | Store<AnyObject | EmptyValue>
> = [MaybeStoreValue<T>, ToStore<T>] extends [infer V, infer S]
  ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
    ? S & {
      [K in keyof Value]-?: PickNonEmptyValue<Value[K]> extends PickObjectValue<Value[K]>
        ? ChildDeepRecord<Value[K] | Empty>
        : Store<Value[K] | Empty>
    }
    : never
  : never
