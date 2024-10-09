import {
  isStore,
  boolean$
} from '@nanoviews/stores'
import type {
  TruthyValueOrStore,
  FalsyValueOrStore,
  PrimitiveChild
} from '../internals/index.js'
import {
  noop,
  decide
} from '../internals/index.js'

/**
 * Decide which child to render based on condition
 * @param $value - Static value or store
 * @returns Function that accepts then and else functions and returns Block that renders decided child
 */
export function if$<T>($value: T) {
  /**
   * Decide which child to render based on condition
   * @param then$ - Function that returns child if condition is true
   * @param else$ - Function that returns child if condition is false
   * @returns Block that renders decided child
   */
  return (
    then$: (value: TruthyValueOrStore<T>) => PrimitiveChild,
    else$: (value: FalsyValueOrStore<T>) => PrimitiveChild = noop
  ) => decide(
    isStore($value) ? boolean$($value) : $value as boolean,
    confition => (
      confition
        ? then$($value as TruthyValueOrStore<T>)
        : else$($value as FalsyValueOrStore<T>)
    )
  )
}
