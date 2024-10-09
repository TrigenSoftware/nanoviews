import {
  isStore,
  listen
} from '@nanoviews/stores'
import type {
  ValueOrStore,
  PrimitiveChild
} from '../types/index.js'
import { childToBlock } from '../elements/child.js'
import { createSwapper } from './swap.js'

/**
 * Dinamicly decide which child to render based on condition
 * @param $condition - Static value or store
 * @param decider - Function that returns child based on condition
 * @returns Block that renders decided child
 */
export function decide<T>(
  $condition: ValueOrStore<T>,
  decider: (value: T, prevValue?: T | undefined) => PrimitiveChild
) {
  if (isStore($condition)) {
    return createSwapper(
      decider($condition.get()),
      swap => listen(
        $condition,
        (condition, prevCondition) => swap(() => decider(condition, prevCondition))
      )
    )
  }

  return childToBlock(decider($condition))
}
