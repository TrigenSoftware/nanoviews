import type {
  ValueOrStore,
  PrimitiveChild
} from '../internals/index.js'
import {
  isStore,
  createSwapper,
  childToBlock
} from '../internals/index.js'

export type Decider<T, R> = (value: T, prevValue?: T | undefined) => R

/**
 * Dinamicly decide which child to render based on condition
 * @param $condition - Static value or store
 * @param decider - Function that returns child based on condition
 * @returns Block that renders decided child
 */
export function decide$<T, R extends PrimitiveChild>(
  $condition: ValueOrStore<T>,
  decider: Decider<T, R>
) {
  if (isStore($condition)) {
    return createSwapper(
      decider($condition.get()),
      swap => $condition.listen(
        (value, prevValue) => swap(() => decider(value, prevValue))
      )
    )
  }

  return childToBlock(decider($condition))
}
