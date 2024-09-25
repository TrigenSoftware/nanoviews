import type {
  Store,
  AnyStore,
  StoreValue,
  StoresValues,
  Runner
} from './types/index.js'
import { onMount } from './lifecycle.js'
import { atom } from './atom.js'
import { effect } from './effect.js'

type UnknownDependency = AnyStore | AnyStore[]
type UnknownCompute = (...values: any[]) => unknown

function compareValues(values: unknown[]) {
  for (let i = 0, offset = values.length / 2; i < offset; i++) {
    if (values[i] !== values[i + offset]) {
      return true
    }
  }

  return false
}

/**
 * Create a computed store, which generates value from another store.
 * @param dependency - The store to compute from.
 * @param compute - The function to compute the value.
 * @param runner - The update runner function. E.g. `throttle`, `debounce`.
 * @returns A computed store.
 */
export function computed<
  D extends AnyStore,
  V
>(
  dependency: D,
  compute: (value: StoreValue<D>) => V,
  runner?: Runner
): Store<V>

/**
 * Create a computed store, which generates value from other stores.
 * @param dependencies - The stores to compute from.
 * @param compute - The function to compute the value.
 * @param runner - The update runner function. E.g. `throttle`, `debounce`.
 * @returns A computed store.
 */
export function computed<
  D extends AnyStore[],
  V
>(
  dependencies: [...D],
  compute: (...values: StoresValues<D>) => V,
  runner?: Runner
): Store<V>

export function computed(
  dependency: UnknownDependency,
  compute: UnknownCompute,
  runner?: Runner
) {
  const $computed = atom()
  const set = (...values: unknown[]) => {
    if (compareValues(values)) {
      $computed.set(compute(...values))
    }
  }
  const runEffect = effect($computed, dependency as AnyStore, set, runner)
  const superGet = $computed.get
  let inactive = true

  $computed.get = () => {
    if (inactive) {
      runEffect()
    }

    return superGet()
  }

  onMount($computed, () => {
    inactive = false
    return () => inactive = true
  })

  runEffect()

  return $computed
}
