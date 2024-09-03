import type {
  AnyStore,
  AsyncStore,
  Store,
  StoreValue,
  StoresValues,
  Runner
} from './types/index.js'
import {
  computedArgs,
  computedBase
} from './internals/index.js'
import { async } from './async.js'
import { task } from './tasks.js'

type UnknownDependency = AnyStore | AnyStore[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownCompute = (...values: any[]) => unknown

/**
 * Create a computed async store, which generates value from another store asynchronously.
 * @param dependency - The store to compute from.
 * @param compute - The async function to compute the value.
 * @param initialValue - Initial value of the store.
 * @returns A computed async store.
 */
export function computedAsync<
  D extends AnyStore,
  R,
  V = undefined
>(
  dependency: D,
  compute: (value: StoreValue<D>) => R | Promise<R>,
  initialValue?: V
): AsyncStore<R | V>

/**
 * Create a computed async store, which generates value from another store asynchronously.
 * @param runner - The update runner function. E.g. `throttle`, `debounce`.
 * @param dependency - The store to compute from.
 * @param compute - The async function to compute the value.
 * @param initialValue - Initial value of the store.
 * @returns A computed async store.
 */
export function computedAsync<
  D extends AnyStore,
  R,
  V = undefined
>(
  runner: Runner,
  dependency: D,
  compute: (value: StoreValue<D>) => R | Promise<R>,
  initialValue?: V
): AsyncStore<R | V>

/**
 * Create a computed async store, which generates value from other stores asynchronously.
 * @param dependencies - The stores to compute from.
 * @param compute - The async function to compute the value.
 * @param initialValue - Initial value of the store.
 * @returns A computed async store.
 */
export function computedAsync<
  D extends AnyStore[],
  R,
  V = undefined
>(
  dependencies: [...D],
  compute: (...values: StoresValues<D>) => R | Promise<R>,
  initialValue?: V
): AsyncStore<R | V>

/**
 * Create a computed async store, which generates value from other stores asynchronously.
 * @param runner - The update runner function. E.g. `throttle`, `debounce`.
 * @param dependencies - The stores to compute from.
 * @param compute - The async function to compute the value.
 * @param initialValue - Initial value of the store.
 * @returns A computed async store.
 */
export function computedAsync<
  D extends AnyStore[],
  R,
  V = undefined
>(
  runner: Runner,
  dependencies: [...D],
  compute: (...values: StoresValues<D>) => R | Promise<R>,
  initialValue?: V
): AsyncStore<R | V>

export function computedAsync(
  dependencyOrRunner: UnknownDependency | Runner,
  computeOrDependency: UnknownCompute | UnknownDependency,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  initialValueOrCompute?: unknown | UnknownCompute,
  maybeInitialValue?: unknown
): Store<unknown> {
  const [
    dependencies,
    compute,
    runner,
    initialValue
  ] = computedArgs(dependencyOrRunner, computeOrDependency, initialValueOrCompute, maybeInitialValue)

  return computedBase(
    initialValue => async(initialValue),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ($store, value) => ($store as AsyncStore<unknown>).run(value as Promise<unknown>),
    dependencies,
    // eslint-disable-next-line @typescript-eslint/require-await
    (...values: unknown[]) => task(async () => compute(...values)),
    runner,
    initialValue
  )
}
