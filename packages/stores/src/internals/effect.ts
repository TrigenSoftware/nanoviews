import type {
  AnyStore,
  StoreValue,
  StoresValues,
  StoresValuesOrUndefined,
  Runner
} from './types/index.js'
import { LevelSymbol } from './types/index.js'
import { toArray } from './utils.js'
import {
  onMount,
  listen
} from './lifecycle.js'

type UnknownDependency = AnyStore | AnyStore[]
type UnknownCallback = (...values: any[]) => unknown

export type RunEffect = () => void

/**
 * Subscribe to dependencies on store mount.
 * @param $store - Mountable store.
 * @param dependency - The store to subscribe to.
 * @param callback - The callback function.
 * @param runner - The update runner function.
 * @returns Run effect function. For internal use.
 */
export function effect<D extends AnyStore>(
  $store: AnyStore,
  dependency: D,
  callback: (value: StoreValue<D>, prevValue: StoreValue<D> | undefined) => void,
  runner?: Runner
): RunEffect

/**
 * Subscribe to dependencies on store mount.
 * @param $store - Mountable store.
 * @param dependencies - Stores to subscribe to.
 * @param callback - The callback function.
 * @param runner - The update runner function.
 * @returns Run effect function. For internal use.
 */
export function effect<D extends AnyStore[]>(
  $store: AnyStore,
  dependencies: [...D],
  callback: (...valuesAndPrevValues: [...StoresValues<D>, ...StoresValuesOrUndefined<D>]) => void,
  runner?: Runner
): RunEffect

export function effect(
  $store: AnyStore,
  dependency: UnknownDependency,
  callback: UnknownCallback,
  runner?: Runner
) {
  const dependencies = toArray(dependency)
  let prevValues: unknown[] = Array(dependencies.length)
  const runEffect = () => {
    const values = dependencies.map($store => $store.get())

    callback(...values, ...prevValues)
    prevValues = values
  }
  const run = runner?.(runEffect) || runEffect

  $store[LevelSymbol] += Math.max(...dependencies.map($store => $store[LevelSymbol])) + 1

  onMount($store, () => {
    const unsubs = dependencies.map($dep => listen($dep, run, -1 / $store[LevelSymbol]))

    runEffect()

    return () => unsubs.forEach(unsub => unsub())
  })

  return runEffect
}

/**
 * Runner function to debounce the updates.
 * @param fn - Update function.
 * @returns Debounced update function.
 */
export function batch(fn: () => void): () => void

export function batch(delay?: number): (fn: () => void) => () => void

export function batch(fnOrDelay?: (() => void) | number) {
  if (typeof fnOrDelay === 'function') {
    return batch()(fnOrDelay)
  }

  return (fn: () => void) => {
    let timer: ReturnType<typeof setTimeout>

    return () => {
      clearTimeout(timer)
      timer = setTimeout(fn, fnOrDelay)
    }
  }
}
