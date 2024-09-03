import type {
  Block,
  PickBlockNode,
  Effect,
  Destroy
} from '../types/index.js'
import { composeEffects } from '../utils.js'

/**
 * Add mount effects to a block
 * @param effects - An array of effects or a single effect
 * @param block - The block to add the effects to
 * @returns Block
 */
export function addEffects<T extends Block>(
  effects: Effect<PickBlockNode<T>> | Effect<PickBlockNode<T>>[] | undefined,
  block: T
) {
  if (!effects) {
    return block
  }

  const superEffect = block.e
  const superDestroy = block.d
  const effect = composeEffects(effects)
  let destroy: Destroy | null

  block.e = () => {
    superEffect()
    destroy = effect(block.n()! as PickBlockNode<T>)
  }

  block.d = () => {
    destroy!()
    superDestroy()
    destroy = null
  }

  return block
}
