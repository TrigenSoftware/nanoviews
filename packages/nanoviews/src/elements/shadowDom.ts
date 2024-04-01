import type {
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
  T extends Element
>(block: ChildrenBlock<T>, options: ShadowRootInit) {
  return (...children: Children) => {
    const childrenBlock = createFragment(children)
    let shadowRoot: ShadowRoot | null

    return block(
      createBlock(
        childrenBlock.c,
        (parentNode) => {
          shadowRoot = (parentNode as Element).attachShadow(options)

          childrenBlock.m(shadowRoot)

          return shadowRoot
        },
        childrenBlock.e,
        () => {
          shadowRoot = null
          childrenBlock.d()
        }
      )
    )
  }
}
