import {
  type Morph,
  $$get,
  $$source,
  morph,
  signal
} from 'agera'
import type { LazyFactory } from './types/index.js'
import { isFunction } from './utils.js'

function lazyGetter<T>(this: Morph<T>) {
  const $source = this[$$source]
  let value = $source()

  this[$$get] = $source

  if (isFunction(value)) {
    $source(value = (value as LazyFactory<T>)())
  }

  return value
}

/**
 * Create a signal that is lazily initialized.
 * @param factory - The factory function.
 * @returns The lazy signal.
 */
export function lazy<T>(factory: LazyFactory<T>) {
  return morph(signal(factory as T), {
    [$$get]: lazyGetter
  })
}
