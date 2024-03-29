import type {
  Block,
  Children,
  ChildrenBlock
} from '../internals/index.js'
import {
  createBlock,
  createFragment
} from '../internals/index.js'

/**
 * Attach shadow to a block
 * @param block - Target block
 * @param options - Shadow root options
 * @returns Block
 */
export function attachShadow<
  T extends (Block<Element> | ChildrenBlock<Element>)
>(block: T, options: ShadowRootInit) {
  const targetBlock = typeof block === 'function' ? block() : block

  return (...children: Children) => {
    const childrenBlock = createFragment(children)
    let shadowRoot: ShadowRoot | null

    return createBlock(
      () => {
        targetBlock.c()
        childrenBlock.c()
      },
      (parentNode, anchor) => {
        const target = targetBlock.m(parentNode, anchor)

        shadowRoot = target!.attachShadow(options)

        childrenBlock.m(shadowRoot)

        return target
      },
      () => {
        targetBlock.e()
        childrenBlock.e()
      },
      () => {
        shadowRoot = null
        childrenBlock.d()
        targetBlock.d()
      }
    )
  }
}
