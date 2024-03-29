import type { PrimitiveChild } from '../types/index.js'
import { isBlock } from '../block.js'
import { createText } from './text.js'

/**
 * Convert child to block
 * @param child - Child
 * @returns Block
 */
export function childToBlock(child: PrimitiveChild) {
  return isBlock(child)
    ? child
    : createText(child)
}
