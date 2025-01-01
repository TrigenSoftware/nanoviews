import type {
  PrimitiveChild,
  Children
} from '../types/index.js'
import {
  isFunction,
  isEmpty,
  noop
} from '../utils.js'
import {
  type Block,
  isBlock
} from '../block.js'
import { createText } from './text.js'

/**
 * Convert child to block
 * @param child - Child
 * @returns Block
 */
export function childToBlock(child: PrimitiveChild) {
  return (
    isFunction(child)
      ? child()
      : isBlock(child)
        ? child
        : createText(child)
  )
}

/**
 * Convert children to blocks
 * @param children
 * @param cb
 * @param blocks
 * @returns Blocks
 */
export function childrenToBlocks(
  children: Children,
  cb: (block: Block) => void = noop,
  blocks: Block[] = []
): Block[] {
  for (let i = 0, len = children.length, child: Children[number], block: Block; i < len; i++) {
    child = children[i]

    if (Array.isArray(child)) {
      childrenToBlocks(child, cb, blocks)
    } else if (!isEmpty(child)) {
      cb(block = childToBlock(child))
      blocks.push(block)
    }
  }

  return blocks
}
