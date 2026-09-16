import {
  type Children,
  type LazyVoidElement,
  type LazyElement,
  appendChildren,
  lazyChild,
  setAttributes
} from '../internals/index.js'
import type {
  ElementName,
  PickElementType,
  Attributes,
  VoidElementFactory,
  ElementFactory
} from './types.js'
import { setAttribute } from './attributes.js'

const namespace = 'http://www.w3.org/2000/svg'

function createNode<Tag extends ElementName>(tag: Tag, attributes: Attributes<Tag> | undefined) {
  const element = document.createElementNS(namespace, tag)

  if (attributes !== undefined) {
    setAttributes(element, attributes, setAttribute)
  }

  return element
}

/**
 * Describe an SVG element without children: the call builds it
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
 * Create SVG element without children factory
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
 * Describe an SVG element: the call with children keeps them, the call with
 * no arguments builds the element with them
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function createElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>
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

    return appendChildren(createNode(tag, attributes), children)
  }) as LazyElement<PickElementType<Tag>>

  return element
}

/**
 * Create SVG element factory
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
