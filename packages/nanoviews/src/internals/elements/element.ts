import type {
  ElementName,
  PickElementType,
  StrictEffect,
  Destroy,
  Block,
  Attributes
} from '../types/index.js'
import { createBlockFromNode } from '../block.js'
import {
  addEffects,
  getChildren
} from '../logic/index.js'
import { createFragment } from './fragment.js'
import { setAttributes } from './attributes.js'

/**
 * Create HTML element block with possible children
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @param childrenBlock - Children block
 * @returns Element block
 */
export function createElementBase<Tag extends ElementName>(
  tag: Tag,
  attributes: Attributes<Tag> = {},
  childrenBlock?: Block
) {
  let effect: StrictEffect<void> | null

  return addEffects(
    () => {
      let destroy: Destroy | null = effect!()

      effect = null

      return () => {
        destroy!()
        destroy = null
      }
    },
    createBlockFromNode(
      () => {
        // @todo: remove `as` when full SVG support will be added
        const element = document.createElement(tag) as PickElementType<Tag>

        effect = setAttributes(element, attributes)

        return element
      },
      childrenBlock
    )
  )
}

/**
 * Create [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Void element block
 */
export function createVoidElement<Tag extends ElementName>(
  tag: Tag,
  attributes: Attributes<Tag> = {}
) {
  return createElementBase(tag, attributes)
}

/**
 * Create [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) factory
 * @param tag - Tag name
 * @returns Function to create given void element block
 */
export function createVoidElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  return (attributes: Attributes<Tag> = {}) => createElementBase(tag, attributes)
}

/**
 * Create HTML element
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Callable block to pass children
 */
export function createElement<Tag extends ElementName>(
  tag: Tag,
  attributes: Attributes<Tag> = {}
) {
  return getChildren(
    children => createElementBase(tag, attributes, createFragment(children))
  )
}

/**
 * Create HTML element factory
 * @param tag - Tag name
 * @returns Function to create given element block
 */
export function createElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  return (attributes: Attributes<Tag> = {}) => createElement(tag, attributes)
}
