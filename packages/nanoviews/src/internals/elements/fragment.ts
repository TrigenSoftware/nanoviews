import type { Children } from '../types/index.js'
import { HostBlock } from '../block.js'
import { linkChildren } from './child.js'

export class FragmentBlock extends HostBlock {
  constructor(children: Children) {
    super()

    linkChildren(this, children)
  }
}

/**
 * Create fragment
 * @param children - Children
 * @returns Fragment block
 */
export function createFragment(...children: Children) {
  return new FragmentBlock(children)
}
