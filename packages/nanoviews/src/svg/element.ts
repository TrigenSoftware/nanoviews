import {
  lazyChild,
  elementChildren
} from '../internals/index.js'
import type {
  ElementName,
  Attributes,
  VoidElementFactory,
  LazyElement,
  ElementFactory
} from './types.js'
import { setAttributes } from './attributes.js'

const namespace = 'http://www.w3.org/2000/svg'

/**
 * Create SVG element without children
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Void element
 */
export function createVoidElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>
) {
  const element = document.createElementNS(namespace, tag)

  if (attributes !== undefined) {
    setAttributes(element, attributes)
  }

  return element
}

/**
 * Create SVG element without children factory
 * @param tag - Tag name
 * @returns Function to create given void element
 */
/* @__NO_SIDE_EFFECTS__ */
export function createVoidElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
  return createVoidElement.bind(null, tag as ElementName) as VoidElementFactory<Tag>
}

/**
 * Create SVG element
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Function to pass children
 */
export function createElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>
) {
  const element = createVoidElement(tag, attributes)

  return lazyChild(elementChildren.bind(element, element)) as LazyElement<Tag>
}

/**
 * Create SVG element factory
 * @param tag - Tag name
 * @returns Function to create given element
 */
/* @__NO_SIDE_EFFECTS__ */
export function createElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
  return createElement.bind(null, tag as ElementName) as ElementFactory<Tag>
}
