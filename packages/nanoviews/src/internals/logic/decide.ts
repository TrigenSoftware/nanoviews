import {
  type ReadableSignal,
  isSignal,
  subscribeLater
} from 'kida'
import type {
  ValueOrSignal,
  PrimitiveChild,
  Effect,
  Destroy
} from '../types/index.js'
import { childToBlock } from '../elements/child.js'
import { Block } from '../block.js'
import {
  addEffect,
  runEffects,
  runDestroys,
  captureEffects
} from '../effects.js'
import {
  getContext,
  run
} from './context.js'

export class DesideBlock<T> extends Block {
  #childBlock!: Block

  constructor(
    $condition: ReadableSignal<T>,
    decider: (value: T, prevValue?: T | undefined) => PrimitiveChild
  ) {
    super()

    const context = getContext()
    let effects: Effect[]
    let destroys: Destroy[]
    const subscribeEffect = subscribeLater(
      $condition,
      (condition, prevCondition) => {
        runDestroys(destroys)
        effects = []

        const prevBlock = this.#childBlock

        if (prevBlock) {
          const nextBlock = childToBlock(
            captureEffects(
              effects,
              () => run(context, () => decider(condition, prevCondition))
            )
          )

          if (prevBlock !== nextBlock) {
            const prevNode = prevBlock.n!

            nextBlock.m(prevNode.parentNode!, prevNode)
            runDestroys(destroys)
            prevBlock.d()
            destroys = runEffects(effects)
            effects = []

            this.#childBlock = nextBlock
          }
        } else {
          this.#childBlock = childToBlock(
            captureEffects(effects, () => decider(condition))
          )
        }
      }
    )

    addEffect(() => {
      const unsubscribe = subscribeEffect()

      destroys = runEffects(effects)

      return () => {
        unsubscribe()
        runDestroys(destroys)
      }
    })
  }

  get n() {
    return this.#childBlock.n
  }

  m(target: Node, anchor?: Node | null) {
    this.#childBlock.m(target, anchor)
  }

  d() {
    this.#childBlock.d()
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
  decider: (value: T, prevValue?: T | undefined) => PrimitiveChild
) {
  if (isSignal($condition)) {
    return new DesideBlock($condition, decider)
  }

  return childToBlock(decider($condition))
}
