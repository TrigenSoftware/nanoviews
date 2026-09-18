import type {
  ElementName,
  PickElementType,
  Attributes,
  Children,
  VoidElementFactory,
  ElementFactory,
  LazyVoidElement,
  LazyElement,
  EmptyValue,
  AttributeSetter
} from '../types/index.js'
import {
  childToNode,
  lazyChild
} from './child.js'
import { setAttributes } from './attributes.js'

/**
 * Build the children, if any, and append them to a node
 * @param target - Parent node
 * @param children - Children to append
 * @returns The parent node
 */
export function appendChildren<T extends ParentNode>(target: T, children: Children | undefined) {
  if (children !== undefined) {
    for (let i = 0, len = children.length, node: ChildNode | DocumentFragment | EmptyValue; i < len; i++) {
      if (node = childToNode(children[i])) {
        target.appendChild(node)
      }
    }
  }

  return target
}

function createNode<Tag extends ElementName>(
  tag: Tag,
  attributes: Attributes<Tag> | undefined,
  attributeSetter?: AttributeSetter<PickElementType<Tag>>
) {
  const element = document.createElement(tag) as PickElementType<Tag>

  if (attributes !== undefined) {
    setAttributes(element, attributes, attributeSetter)
  }

  return element
}

/**
 * Describe a [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element): the call builds it
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Void element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function createVoidElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>,
  attributeSetter?: AttributeSetter<PickElementType<Tag>>
) {
  return lazyChild(() => createNode(tag, attributes, attributeSetter)) as LazyVoidElement<PickElementType<Tag>>
}

/**
 * Create [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) factory
 * @param tag - Tag name
 * @returns Function to describe given void element
 */
/* @__NO_SIDE_EFFECTS__ */
export function createVoidElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
  return createVoidElement.bind(null, tag as ElementName) as VoidElementFactory<Tag>
}

/**
 * Describe an HTML element: the call with children keeps them, the call with
 * no arguments builds the element with them
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function createElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>,
  attributeSetter?: AttributeSetter<PickElementType<Tag>>
) {
  // The receiver is written out here rather than shared through a helper
  // that takes a build callback: one closure per description instead of two
  // is a measured 6% of the time to create a thousand rows, and the same
  // receiver spelled out in every factory compresses better than a helper
  let children: Children | undefined
  const element: LazyElement<PickElementType<Tag>> = lazyChild((...args: Children) => {
    if (args.length) {
      children = args

      return element
    }

    return appendChildren(createNode(tag, attributes, attributeSetter), children)
  }) as LazyElement<PickElementType<Tag>>

  return element
}

/**
 * Create HTML element factory
 * @param tag - Tag name
 * @returns Function to describe given element
 */
/* @__NO_SIDE_EFFECTS__ */
export function createElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
  return createElement.bind(null, tag as ElementName) as ElementFactory<Tag>
}
