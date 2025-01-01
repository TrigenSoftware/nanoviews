import type { ReadableSignal } from './types/index.js'
import { Signal } from './signal.js'
import { $$notify } from './symbols.js'
import {
  onMount,
  listen
} from './lifecycle.js'

export class Mapped<S, R> extends Signal<R> {
  constructor(
    $source: ReadableSignal<S>,
    map: (source: S) => R
  ) {
    super(undefined as R)

    this.get = () => map($source.get())

    onMount(this, () => listen($source, (value, prevValue) => {
      const prevMappedValue = map(prevValue)
      const mappedValue = map(value)

      if (mappedValue !== prevMappedValue) {
        this[$$notify](mappedValue, prevMappedValue)
      }
    }))
  }
}

/**
 * Create store with mapped value.
 * @param $source - Source store.
 * @param map - Mapping function.
 * @returns Mapped store.
 */
export function mapped<S, R>(
  $source: ReadableSignal<S>,
  map: (source: S) => R
): ReadableSignal<R> {
  return new Mapped($source, map)
}
