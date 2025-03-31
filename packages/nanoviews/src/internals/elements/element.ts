import type {
  ElementName,
  PickElementType,
  Attributes,
  Children,
  VoidElementFactory,
  LazyElement,
  ElementFactory
} from '../types/index.js'
import { appendChildren } from './child.js'
import { setAttributes } from './attributes.js'

/**
 * Create [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Void element
 */
export function createVoidElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>
) {
  // @todo: remove `as` when full SVG support will be added
  const element = document.createElement(tag) as PickElementType<Tag>

  if (attributes !== undefined) {
    setAttributes(element, attributes)
  }

  return element
}

/**
 * Create [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) factory
 * @param tag - Tag name
 * @returns Function to create given void element
 */
export function createVoidElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  return createVoidElement.bind(null, tag as ElementName) as VoidElementFactory<Tag>
}

export function elementChildren(this: Element | ShadowRoot, result: Element, ...children: Children) {
  if (children.length) {
    appendChildren(this, children)
  }

  return result
}

/**
 * Create HTML element
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Function to pass children
 */
export function createElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>
) {
  const element = createVoidElement(tag, attributes)

  return elementChildren.bind(element, element) as LazyElement<Tag>
}

/**
 * Create HTML element factory
 * @param tag - Tag name
 * @returns Function to create given element
 */
export function createElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  return createElement.bind(null, tag as ElementName) as ElementFactory<Tag>
}

export function defineProtoProp(name: string, value?: unknown) {
  // @ts-expect-error Define property on prototype
  Element.prototype[name] = value
}
