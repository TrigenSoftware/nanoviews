import {
  type ReadableSignal,
  type Destroy,
  isSignal
} from 'kida'
import type {
  ValueOrSignal,
  Child
} from '../types/index.js'
import {
  createEffectScopeWithContext,
  effectScopeSwapper
} from '../effects.js'
import { createTextNode } from '../elements/text.js'
import {
  insertChildBeforeAnchor,
  removeBetween
} from '../elements/child.js'

export function reactiveDecide<T>(
  $condition: ReadableSignal<T>,
  decider: (value: T) => Child
) {
  const start = createTextNode()
  const end = createTextNode()
  const effectScope = createEffectScopeWithContext()
  let child: Child

  effectScopeSwapper($condition, (
    destroyPrev: Destroy | undefined,
    condition: T
  ) => {
    if (destroyPrev !== undefined) {
      destroyPrev()
      removeBetween(start, end)
    }

    const runEffects = effectScope(
      () => child = decider(condition),
      true
    )

    // Rerender on condition change in effect
    if (destroyPrev !== undefined) {
      insertChildBeforeAnchor(child, end)
      child = undefined
      // Should return effect stop function
      return runEffects()
    }

    // First render, before effects run
    // Should return effect start function
    return runEffects
  })

  return [
    start,
    child,
    end
  ]
}

/**
 * Dinamicly decide which child to render based on condition
 * @param $condition - Static value or store
 * @param decider - Function that returns child based on condition
 * @returns Block that renders decided child
 */
export function decide<T>(
  $condition: ValueOrSignal<T>,
  decider: (value: T) => Child
) {
  if (isSignal($condition)) {
    return reactiveDecide($condition, decider)
  }

  return decider($condition)
}
