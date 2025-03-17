import {
  type ReadableSignal,
  type Destroy,
  isSignal
} from 'kida'
import type {
  ValueOrSignal,
  PrimitiveChild
} from '../types/index.js'
import {
  $$destroy,
  $$first,
  $$mount,
  $$node
} from '../symbols.js'
import {
  createEffectScopeWithContext,
  effectScopeSwapper
} from '../effects.js'
import { childToBlock } from '../elements/child.js'
import {
  type Block,
  HostBlock
} from '../block.js'

export class DecideBlock<T> extends HostBlock {
  declare [$$first]: Block
  readonly #effectScope = createEffectScopeWithContext()
  readonly #decider: (value: T) => PrimitiveChild

  constructor(
    $condition: ReadableSignal<T>,
    decider: (value: T) => PrimitiveChild
  ) {
    super()

    this.#decider = decider

    effectScopeSwapper($condition, this.#swapper.bind(this))
  }

  #swapper(
    destroyPrev: Destroy | undefined,
    condition: T
  ) {
    destroyPrev?.()

    const prevBlock = this[$$first]
    const runEffects = this.#effectScope(
      () => this[$$first] = childToBlock(
        this.#decider(condition)
      ),
      true
    )

    // Rerender on condition change in effect
    if (destroyPrev) {
      const prevNode = prevBlock[$$node]!

      this[$$first][$$mount](prevNode.parentNode!, prevNode)
      prevBlock[$$destroy]()

      // Should return effect stop function
      return runEffects()
    }

    // First render, before effects run
    // Should return effect start function
    return runEffects
  }
}

/**
 * Dinamicly decide which child to render based on condition
 * @param $condition - Static value or store
 * @param decider - Function that returns child based on condition
 * @returns Block that renders decided child
 */
export function decide<T>(
  $condition: ValueOrSignal<T>,
  decider: (value: T) => PrimitiveChild
) {
  if (isSignal($condition)) {
    return new DecideBlock($condition, decider)
  }

  return childToBlock(decider($condition))
}
