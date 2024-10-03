import type {
  AnyStore,
  AnyFn,
  AnyDependency,
  StoreValue,
  StoresValues,
  StoresValuesOrUndefined,
  Runner,
  RunEffect,
  Destroy
} from './types/index.js'
import { LevelSymbol } from './types/index.js'
import { toArray } from './utils.js'
import {
  onMount,
  listen
} from './lifecycle.js'

/**
 * Create a subscriber for multiple dependencies.
 * @param dependency - The store or stores to subscribe to.
 * @param callback - The callback function.
 * @param runner - The runner function.
 * @param level - The listener level.
 * @returns Subscriber and run effect functions.
 */
export function createManySubscriber(
  dependency: AnyDependency,
  callback: AnyFn,
  runner?: Runner,
  level?: number
) {
  const dependencies = toArray(dependency)
  let prevValues: unknown[] = Array(dependencies.length)
  let destroy: Destroy
  const runEffect = () => {
    destroy?.()

    const values = dependencies.map($store => $store.get())

    destroy = callback(...values, ...prevValues)
    prevValues = values
  }
  const run = runner?.(runEffect) || runEffect
  const listenLevel = level === undefined ? level : -1 / level
  const subscribe = () => {
    const unsubs = dependencies.map($dep => listen($dep, run, listenLevel))

    runEffect()

    return () => {
      unsubs.forEach(unsub => unsub())
      destroy?.()
      destroy = undefined
    }
  }

  return [subscribe, runEffect] as const
}

/**
 * Subscribe to dependencies on store mount.
 * @param $store - Mountable store.
 * @param dependency - The store to subscribe to.
 * @param callback - The callback function.
 * @param runner - The runner function.
 * @returns Run effect function. For internal use.
 */
export function effect<D extends AnyStore>(
  $store: AnyStore,
  dependency: D,
  callback: (value: StoreValue<D>, prevValue: StoreValue<D> | undefined) => Destroy,
  runner?: Runner
): RunEffect

/**
 * Subscribe to dependencies on store mount.
 * @param $store - Mountable store.
 * @param dependencies - Stores to subscribe to.
 * @param callback - The callback function.
 * @param runner - The runner function.
 * @returns Run effect function. For internal use.
 */
export function effect<D extends AnyStore[]>(
  $store: AnyStore,
  dependencies: [...D],
  callback: (...valuesAndPrevValues: [...StoresValues<D>, ...StoresValuesOrUndefined<D>]) => Destroy,
  runner?: Runner
): RunEffect

export function effect(
  $store: AnyStore,
  dependency: AnyDependency,
  callback: AnyFn,
  runner?: Runner
) {
  const dependencies = toArray(dependency)
  const [subscribe, runEffect] = createManySubscriber(
    dependencies,
    callback,
    runner,
    $store[LevelSymbol] += Math.max(...dependencies.map($store => $store[LevelSymbol])) + 1
  )

  onMount($store, subscribe)

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
