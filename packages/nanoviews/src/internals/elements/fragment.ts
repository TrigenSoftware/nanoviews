import type { Children } from '../types/index.js'
import { Block } from '../block.js'
import { childrenToBlocks } from './child.js'

export class FragmentBlock extends Block {
  readonly #blocks: Block[]

  constructor(children: Children) {
    super()

    this.#blocks = childrenToBlocks(children)
  }

  get n() {
    return this.#blocks[0]?.n
  }

  m(target: Node, anchor?: Node | null) {
    const blocks = this.#blocks
    const len = blocks.length

    if (len) {
      for (let i = 0; i < len; i++) {
        blocks[i].m(target, anchor)
      }
    }
  }

  d() {
    const blocks = this.#blocks
    const len = blocks.length

    if (len) {
      for (let i = 0; i < len; i++) {
        blocks[i].d()
      }
    }
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
