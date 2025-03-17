import {
  type Block,
  $$mount
} from '../internals/index.js'

/**
 * Render block in the target node
 * @param target
 * @param block
 * @returns Portal block
 */
export function portal$<T extends Block>(target: Node, block: T) {
  const superMount = block[$$mount].bind(block)

  block[$$mount] = () => superMount(target)

  return block
}
