import {
  type Accessor,
  type ValueOrAccessor,
  type Destroy,
  isAccessor
} from 'kida'
import type { Child } from '../types/index.js'
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
  $condition: Accessor<T>,
  decider: (value: T) => Child
) {
  const start = createTextNode()
  const end = createTextNode()
  const effectScope = createEffectScopeWithContext()
  const fragment = document.createDocumentFragment()

  fragment.append(start, end)

  effectScopeSwapper($condition, (
    destroyPrev: Destroy | undefined,
    condition: T
  ) => {
    if (destroyPrev !== undefined) {
      destroyPrev()
      removeBetween(start, end)
    }

    const runEffects = effectScope(
      () => insertChildBeforeAnchor(decider(condition), end),
      true
    )

    // Rerender on condition change in effect
    if (destroyPrev !== undefined) {
      // Should return effect stop function
      return runEffects()
    }

    // First render, before effects run
    // Should return effect start function
    return runEffects
  })

  return fragment
}

/**
 * Dinamicly decide which child to render based on condition
 * @param $condition - Static value or store
 * @param decider - Function that returns child based on condition
 * @returns Block that renders decided child
 */
export function decide<T>(
  $condition: ValueOrAccessor<T>,
  decider: (value: T) => Child
) {
  if (isAccessor($condition)) {
    return reactiveDecide($condition, decider)
  }

  return decider($condition)
}
