import {
  type WritableSignal,
  $$get,
  $$set,
  $$source,
  morph,
  signal
} from 'agera'
import type {
  ExternalFactory,
  External
} from './types/index.js'
import { $$factory } from './internals/index.js'

function lazyGetterSetter<T>(this: External<T>, ...value: [T]): T | void {
  const $source = this[$$source]
  const setter = this[$$factory]($source)

  this[$$get] = $source
  this[$$set] = setter === undefined
    ? $source
    : setter

  if (value.length) {
    this[$$set](value[0])
  } else {
    return $source()
  }
}

/**
 * Create a signal that is controlled by an external source.
 * @param factory - The factory function.
 * @returns The external signal.
 */
export function external<T>(
  factory: ExternalFactory<T>
) {
  return morph(signal<T>(), {
    [$$get]: lazyGetterSetter as () => T,
    [$$set]: lazyGetterSetter,
    [$$factory]: factory
  }) as WritableSignal<T>
}
