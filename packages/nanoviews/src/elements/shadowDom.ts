import {
  type Children,
  type LazyElement,
  appendChildren,
  lazyChild
} from '../internals/index.js'

/**
 * Describe an element with a shadow root: the children go into the root
 * @param factory - Element description or factory
 * @param options - Shadow root options
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function shadow<T extends Element>(
  factory: () => T,
  options: ShadowRootInit
) {
  let children: Children | undefined
  const element: LazyElement<T> = lazyChild((...args: Children) => {
    if (args.length) {
      children = args

      return element
    }

    const node = factory()

    appendChildren(node.attachShadow(options), children)

    return node
  }) as LazyElement<T>

  return element
}
