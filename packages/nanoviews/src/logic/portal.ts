import type { Block } from '../internals/index.js'
import { createBlock } from '../internals/index.js'

/**
 * Render block in the target node
 * @param target
 * @param block
 * @returns Portal block
 */
export function portal$<T extends Block>(target: Node, block: T) {
  return createBlock(
    block.c,
    () => block.m(target),
    block.e,
    block.d
  )
}
