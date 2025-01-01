import type {
  AnySignal,
  AnyReadableSignal,
  ReadableSignal,
  Observer,
  MountHook,
  GetHook,
  StoresUnsubs,
  Runner
} from './types/index.js'
import {
  listen,
  onMount
} from './lifecycle.js'
import {
  noop,
  isFunction
} from './utils.js'

export function defaultGetHook<T>($signal: ReadableSignal<T>) {
  return $signal.get()
}

/**
 * Run observer function and re-run it when the dependencies change.
 * @param observer - Observer function.
 * @param runner - The update runner function. E.g. `throttle`, `debounce`.
 * @param mountHook - Hook to run after the observer is started.
 * @param getHook - Hook to get the value of the store.
 * @returns Unsubscribe function.
 */
export function observe(
  observer: Observer,
  runner?: Runner,
  mountHook: MountHook = noop,
  getHook: GetHook = defaultGetHook
) {
  const stores: StoresUnsubs = new Map()
  const addDependency = ($signal: AnyReadableSignal) => {
    if (!stores.has($signal)) {
      stores.set($signal, listen($signal, run))
    }
  }
  const get: GetHook = ($signal) => {
    const value = getHook($signal)

    addDependency($signal)

    return value
  }
  let destroy = noop
  let warmup = true
  const fn = () => {
    destroy()
    destroy = observer(get, warmup) || noop
  }
  const run = runner ? runner(fn) : fn

  fn()
  warmup = false
  mountHook(addDependency)

  return () => {
    destroy()
    stores.forEach(unsub => unsub())
    stores.clear()
  }
}

/**
 * Start observer after the store is mounted.
 * @param $signal - Store to listen mount event.
 * @param observer - Observer function.
 * @param runner - The update runner function. E.g. `throttle`, `debounce`.
 * @param mountHook - Hook to run after the observer is started.
 * @param getHook - Hook to get the value of the store.
 * @returns Unsubscribe function.
 */
export function effect(
  $signal: AnySignal,
  observer: Observer,
  runner?: Runner,
  mountHook?: MountHook,
  getHook?: GetHook
) {
  return onMount($signal, () => observe(observer, runner, mountHook, getHook))
}

/**
 * Runner function to debounce the updates.
 * @param fn - Update function.
 * @returns Debounced update function.
 */
export function batch<T extends unknown[]>(fn: (...args: [...T]) => void): (...args: T) => void

/**
 * Runner function to debounce the updates.
 * @param delay - Delay in milliseconds.
 * @returns Runner function.
 */
export function batch(delay?: number): <T extends unknown[]>(fn: (...args: [...T]) => void) => (...args: T) => void

export function batch(fnOrDelay?: (() => void) | number) {
  if (isFunction(fnOrDelay)) {
    return batch()(fnOrDelay)
  }

  return (fn: (...args: any[]) => void) => {
    let timer: ReturnType<typeof setTimeout>

    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(fn, fnOrDelay, ...args)
    }
  }
}

