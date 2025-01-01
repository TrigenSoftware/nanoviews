import type {
  ElementName,
  PickElementType,
  Attributes,
  Children
} from '../types/index.js'
import { NodeBlock } from '../block.js'
import { childrenToBlocks } from './child.js'
import { setAttributes } from './attributes.js'

/**
 * Create [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element)
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Void element block
 */
export function createVoidElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>
) {
  // @todo: remove `as` when full SVG support will be added
  const element = document.createElement(tag) as PickElementType<Tag>

  if (attributes) {
    setAttributes(element, attributes)
  }

  return new NodeBlock(element)
}

/**
 * Create [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) factory
 * @param tag - Tag name
 * @returns Function to create given void element block
 */
export function createVoidElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  return (attributes?: Attributes<Tag>) => createVoidElement(tag, attributes)
}

/**
 * Create HTML element
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Callable block to pass children
 */
export function createElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>
) {
  const block = createVoidElement(tag, attributes)
  const node = block.n

  return (...children: Children) => {
    if (children.length) {
      childrenToBlocks(children, block => block.m(node))
    }

    return block
  }
}

/**
 * Create HTML element factory
 * @param tag - Tag name
 * @returns Function to create given element block
 */
export function createElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  return (attributes?: Attributes<Tag>) => createElement(tag, attributes)
}
