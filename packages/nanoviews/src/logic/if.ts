import {
  isSignal,
  boolean$
} from 'kida'
import {
  type TruthyValueOrSignal,
  type FalsyValueOrSignal,
  type PrimitiveChild,
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
    then$: (value: TruthyValueOrSignal<T>) => PrimitiveChild,
    else$: (value: FalsyValueOrSignal<T>) => PrimitiveChild = noop
  ) => decide(
    isSignal($value) ? boolean$($value) : $value as boolean,
    confition => (
      confition
        ? then$($value as TruthyValueOrSignal<T>)
        : else$($value as FalsyValueOrSignal<T>)
    )
  )
}
