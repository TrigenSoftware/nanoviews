import type { Block } from '../internals/index.js'

/**
 * Render block in the target node
 * @param target
 * @param block
 * @returns Portal block
 */
export function portal$<T extends Block>(target: Node, block: T) {
  const superMount = block.m.bind(block)

  block.m = () => superMount(target)

  return block
}
