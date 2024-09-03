import type {
  Store,
  AnyStore,
  StoreValue,
  StoresValues,
  Runner
} from './types/index.js'
import { LevelSymbol } from './types/index.js'
import { toArray } from './utils.js'
import {
  onMount,
  listen
} from './lifecycle.js'
import {
  atom,
  setLevel
} from './atom.js'

type UnknownDependency = AnyStore | AnyStore[]
type UnknownCompute = (...values: any[]) => unknown

/**
 * Get the arguments for the computed store creator.
 * @param dependencyOrRunner
 * @param computeOrDependency
 * @param initialValueOrCompute
 * @param maybeInitialValue
 * @returns Baked arguments.
 */
export function computedArgs(
  dependencyOrRunner: UnknownDependency | Runner,
  computeOrDependency: UnknownCompute | UnknownDependency,
  initialValueOrCompute?: unknown | UnknownCompute,
  maybeInitialValue?: unknown
): [UnknownDependency, UnknownCompute, Runner?, unknown?] {
  return typeof dependencyOrRunner === 'function'
    ? [
      computeOrDependency as UnknownDependency,
      initialValueOrCompute as UnknownCompute,
      dependencyOrRunner,
      maybeInitialValue
    ]
    : [
      dependencyOrRunner,
      computeOrDependency as UnknownCompute,
      undefined,
      initialValueOrCompute
    ]
}

/**
 * Create a computed store.
 * @param createStore
 * @param applyStoreValue
 * @param dependency
 * @param compute
 * @param runner
 * @param initialValue
 * @returns A computed store.
 */
export function computedBase(
  createStore: (
    initialValue: unknown,
    computeValues: (values: unknown[]) => unknown,
    getValues: () => unknown[],
    isActive: () => boolean,
    set: () => void
  ) => Store<unknown>,
  applyStoreValue: (store: Store<unknown>, value: unknown) => void,
  dependency: UnknownDependency,
  compute: UnknownCompute,
  runner?: Runner,
  initialValue?: unknown
): Store<unknown> {
  const dependencies = toArray(dependency)
  const getValues = () => dependencies.map($store => $store.get())
  let prevValues: unknown[] = []
  const computeValues = (values: unknown[]) => compute(...prevValues = values)
  // eslint-disable-next-line prefer-const
  let $computed: Store<unknown>
  const set = () => {
    const values = getValues()

    if (values.some((value, i) => value !== prevValues[i])) {
      applyStoreValue($computed, computeValues(values))
    }
  }
  const run = runner?.(set) || set
  let active = false

  $computed = setLevel(
    createStore(
      initialValue,
      computeValues,
      getValues,
      () => active,
      set
    ),
    Math.max(...dependencies.map($store => $store[LevelSymbol])) + 1
  )

  onMount($computed, () => {
    active = true

    const unsubs = dependencies.map($store => listen($store, run, -1 / $computed[LevelSymbol]))

    set()

    return () => {
      unsubs.forEach(unsub => unsub())
      active = false
    }
  })

  return $computed
}

/**
 * Create a computed store, which generates value from another store.
 * @param dependency - The store to compute from.
 * @param compute - The function to compute the value.
 * @returns A computed store.
 */
export function computed<
  D extends AnyStore,
  V
>(
  dependency: D,
  compute: (value: StoreValue<D>) => V
): Store<V>

/**
 * Create a computed store, which generates value from another store.
 * @param runner - The update runner function. E.g. `throttle`, `debounce`.
 * @param dependency - The store to compute from.
 * @param compute - The function to compute the value.
 * @returns A computed store.
 */
export function computed<
  D extends AnyStore,
  V
>(
  runner: Runner,
  dependency: D,
  compute: (value: StoreValue<D>) => V
): Store<V>

/**
 * Create a computed store, which generates value from other stores.
 * @param dependencies - The stores to compute from.
 * @param compute - The function to compute the value.
 * @returns A computed store.
 */
export function computed<
  D extends AnyStore[],
  V
>(
  dependencies: [...D],
  compute: (...values: StoresValues<D>) => V
): Store<V>

/**
 * Create a computed store, which generates value from other stores.
 * @param runner - The update runner function. E.g. `throttle`, `debounce`.
 * @param dependencies - The stores to compute from.
 * @param compute - The function to compute the value.
 * @returns A computed store.
 */
export function computed<
  D extends AnyStore[],
  V
>(
  runner: Runner,
  dependencies: [...D],
  compute: (...values: StoresValues<D>) => V
): Store<V>

export function computed(
  dependencyOrRunner: UnknownDependency | Runner,
  computeOrDependency: UnknownCompute | UnknownDependency,
  initialValueOrCompute?: unknown | UnknownCompute
): Store<unknown> {
  return computedBase(
    (_, computeValues, getValues, isActive, set) => {
      const $store = atom(computeValues(getValues()))
      const superGet = $store.get

      $store.get = () => {
        if (!isActive()) {
          set()
        }

        return superGet()
      }

      return $store
    },
    ($store, value) => $store.set(value),
    ...computedArgs(dependencyOrRunner, computeOrDependency, initialValueOrCompute)
  )
}

/**
 * Computed store update runner function to debounce the updates.
 * @param fn - Update function.
 * @returns Debounced update function.
 */
export function batch(fn: () => void) {
  let timer: ReturnType<typeof setTimeout>

  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn)
  }
}
