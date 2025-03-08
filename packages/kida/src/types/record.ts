import type {
  SignalValue,
  AnyReadableSignal,
  AnyWritableSignal,
  ReadableSignal,
  WritableSignal
} from 'agera'
import type {
  GenericRecordValue,
  PickEmptyValue,
  PickNonEmptyValue,
  PickObjectValue
} from '../internals/types/index.js'

export type ReadableRecord<
  T extends AnyReadableSignal
> = SignalValue<T> extends infer V
  ? V extends GenericRecordValue
    ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
      ? T & {
        [K in keyof Value as `$${string & K}`]-?: ReadableSignal<Value[K] | Empty>
      }
      : never
    : never
  : never

export type WritableRecord<
  T extends AnyWritableSignal
> = SignalValue<T> extends infer V
  ? V extends GenericRecordValue
    ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
      ? T & {
        [K in keyof Value as `$${string & K}`]-?: WritableSignal<Value[K] | Empty>
      }
      : never
    : never
  : never

export type ReadableDeepRecord<
  T extends AnyReadableSignal
> = SignalValue<T> extends infer V
  ? V extends GenericRecordValue
    ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
      ? T & {
        [K in keyof Value as `$${string & K}`]-?: PickNonEmptyValue<Value[K]> extends PickObjectValue<Value[K]>
          ? Value[K] | Empty extends infer C
            ? C extends GenericRecordValue
              ? ReadableDeepRecord<ReadableSignal<C>>
              : never
            : never
          : ReadableSignal<Value[K] | Empty>
      }
      : never
    : never
  : never

export type WritableDeepRecord<
  T extends AnyWritableSignal
> = SignalValue<T> extends infer V
  ? V extends GenericRecordValue
    ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
      ? T & {
        [K in keyof Value as `$${string & K}`]-?: PickNonEmptyValue<Value[K]> extends PickObjectValue<Value[K]>
          ? Value[K] | Empty extends infer C
            ? C extends GenericRecordValue
              ? WritableDeepRecord<WritableSignal<C>>
              : never
            : never
          : WritableSignal<Value[K] | Empty>
      }
      : never
    : never
  : never
