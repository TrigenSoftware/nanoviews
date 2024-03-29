import type { Children } from '../types/index.js'
import { mapFlatNotEmpty } from '../utils.js'
import { createBlockFromBlocks } from '../block.js'
import { childToBlock } from './child.js'

function childrenToBlocks(children: Children) {
  return mapFlatNotEmpty(
    children,
    child => childToBlock(child)
  )
}

/**
 * Create fragment
 * @param children - Children
 * @returns Fragment block
 */
export function createFragment(...children: Children) {
  return createBlockFromBlocks(
    childrenToBlocks(children)
  )
}
