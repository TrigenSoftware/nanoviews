import type { Block } from './internals/types/index.js'

/**
 * Render a block into a node
 * @param block - The block to render
 * @param node - The node to render into
 * @returns A function to unmount the block
 */
export function render(block: Block, node: Node) {
  block.c()
  block.m(node)
  block.e()

  return block.d
}
