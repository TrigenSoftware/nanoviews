import type {
  Children,
  ElementName,
  ElementFactory,
  VoidElementFactory,
  Attributes
} from 'nanoviews'
import {
  state,
  renderChildren
} from './render.js'
import { stringifyAttributes } from './attributes.js'

const voidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr'
])

/**
 * The end tag of an element: none for a void one, whatever described it
 * @param tag - Tag name
 * @returns The end tag, or an empty string
 */
function endTag(tag: string) {
  return voidTags.has(tag) ? '' : `</${tag}>`
}

// The text of a script or a style is not markup: the client inserts it as
// it is, and so does the markup, but for the sequences that would end the
// element early. They are escaped the way React escapes them, in the
// language of the element, so the code means the same
function escapeScript(text: string) {
  return text.replace(/(<\/|<)(s)(cript)/gi, (_, prefix: string, s: string, suffix: string) => `${prefix}${s === 's' ? '\\u0073' : '\\u0053'}${suffix}`)
}

function escapeStyle(text: string) {
  return text.replace(/(<\/|<)(s)(tyle)/gi, (_, prefix: string, s: string, suffix: string) => `${prefix}${s === 's' ? '\\73 ' : '\\53 '}${suffix}`)
}

// The factory of the elements whose text the parser reads in a way of its
// own, with the receiver of nanoviews written out in it. The tags and the way
// of the text come from the element factory, once per tag
/* @__NO_SIDE_EFFECTS__ */
function createTextElementFactory(
  start: string,
  end: string,
  escape: ((text: string) => string) | undefined,
  startEnd: string
) {
  return (attributes: object | undefined) => {
    let children: Children | undefined
    const description = (...args: Children) => {
      if (args.length) {
        children = args

        return description
      }

      state.html += attributes === undefined ? `${start}${startEnd}` : `${start}${stringifyAttributes(attributes)}${startEnd}`

      if (escape === undefined) {
        renderChildren(children)
        state.html += end
      } else {
        // The text is written aside and escaped at once, so a sequence that
        // would end the element cannot hide across two children
        const { html } = state

        state.html = ''
        state.raw = true
        renderChildren(children)
        state.raw = false
        state.html = html + escape(state.html) + end
      }
    }

    return description
  }
}

/**
 * Write an HTML element
 * @param start - The start of its start tag, `<tag`
 * @param end - Its end tag, empty for a void element, which has no content
 * @param attributes - Element attributes
 * @param children - Element children
 */
export function writeElement(
  start: string,
  end: string,
  attributes: object | undefined,
  children: Children | undefined
) {
  // The start tag is put together first and written once: one piece of
  // markup instead of one per attribute
  state.html += attributes === undefined ? `${start}>` : `${start}${stringifyAttributes(attributes)}>`

  if (end) {
    renderChildren(children)
    state.html += end
  }
}

/**
 * Describe a [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element): the call writes it
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Void element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function createVoidElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>
) {
  return createVoidElementFactory(tag)(attributes)
}

/**
 * Create [void HTML element](https://developer.mozilla.org/en-US/docs/Glossary/Void_element) factory.
 * The tags are put together once, for every element it describes
 * @param tag - Tag name
 * @returns Function to describe given void element
 */
/* @__NO_SIDE_EFFECTS__ */
export function createVoidElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  const start = `<${tag}`
  const end = endTag(tag)

  // A description without children is a writer bound to what it describes:
  // one object instead of a closure and its context. What it is bound to is
  // always an object, since a bundle that drops strict mode, as CommonJS of
  // esbuild does, turns an empty `this` into the global object, so an
  // element without attributes is the bare writer itself
  function write(this: object) {
    writeElement(start, end, this, undefined)
  }

  const writeBare = () => {
    writeElement(start, end, undefined, undefined)
  }

  return ((attributes?: Attributes<Tag>) => (
    attributes === undefined ? writeBare : write.bind(attributes)
  )) as unknown as VoidElementFactory<Tag>
}

/**
 * Describe an HTML element: the call with children keeps them, the call with
 * no arguments writes the element with them
 * @param tag - Tag name
 * @param attributes - Element attributes
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function createElement<Tag extends ElementName>(
  tag: Tag,
  attributes?: Attributes<Tag>
) {
  return createElementFactory(tag)(attributes)
}

/**
 * Create HTML element factory. The tags are put together once, for every
 * element it describes
 * @param tag - Tag name
 * @returns Function to describe given element
 */
/* @__NO_SIDE_EFFECTS__ */
export function createElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  const start = `<${tag}`
  const end = endTag(tag)

  // A script and a style have text that is not markup, and the parser drops
  // the newline right after the start tag of a pre and a textarea, so they
  // are given one to drop
  if (tag === 'script' || tag === 'style') {
    return createTextElementFactory(start, end, tag === 'script' ? escapeScript : escapeStyle, '>') as unknown as ElementFactory<Tag>
  }

  if (tag === 'pre' || tag === 'textarea') {
    return createTextElementFactory(start, end, undefined, '>\n') as unknown as ElementFactory<Tag>
  }

  // The receiver of nanoviews, written out here as in its factories: a
  // description keeps its attributes and children, and takes the tags from
  // the factory
  return ((attributes?: Attributes<Tag>) => {
    let children: Children | undefined
    const description = (...args: Children) => {
      if (args.length) {
        children = args

        return description
      }

      writeElement(start, end, attributes, children)
    }

    return description
  }) as unknown as ElementFactory<Tag>
}
