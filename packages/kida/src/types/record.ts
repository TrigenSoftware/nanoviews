import type {
  GenericRecordValue,
  PickEmptyValue,
  PickNonEmptyValue,
  SignalValue,
  PickObjectValue,
  ReadableSignal,
  WritableSignal
} from '../internals/types/index.js'

export type ReadableRecord<
  T extends ReadableSignal<GenericRecordValue>
> = SignalValue<T> extends infer V
  ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
    ? T & {
      [K in keyof Value]-?: ReadableSignal<Value[K] | Empty>
    }
    : never
  : never

export type WritableRecord<
  T extends WritableSignal<GenericRecordValue>
> = SignalValue<T> extends infer V
  ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
    ? T & {
      [K in keyof Value]-?: WritableSignal<Value[K] | Empty>
    }
    : never
  : never

export type ReadableDeepRecord<
  T extends ReadableSignal<GenericRecordValue>
> = SignalValue<T> extends infer V
  ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
    ? T & {
      [K in keyof Value]-?: PickNonEmptyValue<Value[K]> extends PickObjectValue<Value[K]>
        ? Value[K] | Empty extends infer C
          ? C extends GenericRecordValue
            ? ReadableDeepRecord<ReadableSignal<C>>
            : never
          : never
        : ReadableSignal<Value[K] | Empty>
    }
    : never
  : never

export type WritableDeepRecord<
  T extends WritableSignal<GenericRecordValue>
> = SignalValue<T> extends infer V
  ? [PickNonEmptyValue<V>, PickEmptyValue<V>] extends [infer Value, infer Empty]
    ? T & {
      [K in keyof Value]-?: PickNonEmptyValue<Value[K]> extends PickObjectValue<Value[K]>
        ? Value[K] | Empty extends infer C
          ? C extends GenericRecordValue
            ? WritableDeepRecord<WritableSignal<C>>
            : never
          : never
        : WritableSignal<Value[K] | Empty>
    }
    : never
  : never
