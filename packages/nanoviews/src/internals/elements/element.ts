import type {
  ElementName,
  PickElementType,
  Attributes,
  Children,
  VoidElementFactory,
  ElementFactory,
  LazyVoidElement,
  LazyElement,
  EmptyValue
} from '../types/index.js'
import {
  childToNode,
  lazyChild
} from './child.js'
import {
  type AttributeSetter,
  setAttributes
} from './attributes.js'

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

/**
 * Create an element and set its attributes
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @param set - Attribute setter, for an element that binds some of its attributes its own way
 * @returns The element
 */
export function createNode<Tag extends ElementName>(
  tag: Tag,
  attributes: Attributes<Tag> | undefined,
  set?: AttributeSetter<PickElementType<Tag>>
) {
  const element = document.createElement(tag) as PickElementType<Tag>

  if (attributes !== undefined) {
    setAttributes(element, attributes, set)
  }

  return element
}

/**
 * Build an element with its attributes and children
 */
export type BuildElement<Tag extends ElementName> = (
  tag: Tag,
  attributes: Attributes<Tag> | undefined,
  children: Children | undefined
) => PickElementType<Tag>

/**
 * Build an element: the attributes are set, then the children are appended
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @param children - Element children
 * @returns The element
 */
export function buildElement<Tag extends ElementName>(
  tag: Tag,
  attributes: Attributes<Tag> | undefined,
  children: Children | undefined
) {
  return appendChildren(createNode(tag, attributes), children)
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
  attributes?: Attributes<Tag>
) {
  return lazyChild(() => createNode(tag, attributes)) as LazyVoidElement<PickElementType<Tag>>
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
 * @param build - Element builder, for an element that binds its attributes or children its own way
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function createElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>,
  build: BuildElement<Tag> = buildElement
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

    return build(tag, attributes, children)
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
