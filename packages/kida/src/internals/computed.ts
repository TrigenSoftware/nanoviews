import type {
  AnyReadableSignal,
  ReadableSignal,
  Compute,
  Runner,
  MountHook,
  GetHook
} from './types/index.js'
import { Signal } from './signal.js'
import { epoch } from './emitter.js'
import { $$value } from './symbols.js'
import {
  effect,
  defaultGetHook
} from './effect.js'

type StoresValuesMap = Map<AnyReadableSignal, unknown>

function compareValues(values: StoresValuesMap) {
  if (!values.size) {
    return true
  }

  for (const [$signal, value] of values) {
    if ($signal.get() !== value) {
      return true
    }
  }

  return false
}

export class Computed<T> extends Signal<T> {
  readonly #update

  constructor(
    compute: Compute<T>,
    runner?: Runner
  ) {
    super(undefined as T)

    const values: StoresValuesMap = new Map()
    const getHook: GetHook = ($signal) => {
      const value = defaultGetHook($signal)

      values.set($signal, value)

      return value
    }
    let currentEpoch: number
    const update = (get = getHook, warmup = true) => {
      if (currentEpoch !== epoch) {
        currentEpoch = epoch

        if (compareValues(values)) {
          const value = compute(get)

          if (warmup) {
            this[$$value] = value
          } else {
            this.set(value)
          }

          currentEpoch = epoch
        }
      }
    }
    const mountHook: MountHook = addDependency => values.forEach(
      (_, $signal) => addDependency($signal)
    )

    this.#update = update

    effect(
      this,
      update,
      runner,
      mountHook,
      getHook
    )
  }

  override get() {
    this.#update()

    return super.get()
  }
}

/**
 * Create a computed store, which generates value from another stores.
 * @param compute - The function to compute the value.
 * @param runner - The update runner function. E.g. `throttle`, `debounce`.
 * @returns A computed store.
 */
export function computed<T>(
  compute: Compute<T>,
  runner?: Runner
): ReadableSignal<T> {
  return new Computed(compute, runner)
}
