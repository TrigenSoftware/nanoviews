import type { Children } from 'nanoviews'
import type {
  ElementName,
  Attributes,
  VoidElementFactory,
  ElementFactory
} from 'nanoviews/svg'
import {
  isEventHandler,
  toSvgAttributeName
} from 'nanoviews/internals'
import {
  state,
  renderChildren
} from '../internals/render.js'
import {
  cachedName,
  checkName,
  stringifyAttribute
} from '../internals/attributes.js'

const svgPrefixes = new Map<string, string>()

function toSvgPrefix(name: string) {
  return ` ${checkName(toSvgAttributeName(name))}="`
}

// An SVG element always has an end tag: written self-closing, it would stay
// open outside of an `svg`. Its names keep their case. The rules take the
// prop name, which the mapping leaves alone wherever a rule looks at it
function writeSvgElement(
  start: string,
  end: string,
  attributes: object | undefined,
  children: Children | undefined
) {
  let tag = start

  for (const key in attributes) {
    const value = (attributes as Record<string, unknown>)[key]

    if (!isEventHandler(key, value)) {
      tag += stringifyAttribute(key, cachedName(svgPrefixes, key, toSvgPrefix), value)
    }
  }

  state.html += `${tag}>`
  renderChildren(children)
  state.html += end
}

/**
 * Describe an SVG element without children: the call writes it
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
 * Create SVG element without children factory. The tags are put together
 * once, for every element it describes
 * @param tag - Tag name
 * @returns Function to describe given void element
 */
/* @__NO_SIDE_EFFECTS__ */
export function createVoidElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  const start = `<${tag}`
  const end = `</${tag}>`

  // Bound to its attributes, and bare without them, as an HTML void element
  function write(this: object) {
    writeSvgElement(start, end, this, undefined)
  }

  const writeBare = () => {
    writeSvgElement(start, end, undefined, undefined)
  }

  return ((attributes?: Attributes<Tag>) => (
    attributes === undefined ? writeBare : write.bind(attributes)
  )) as unknown as VoidElementFactory<Tag>
}

/**
 * Describe an SVG element: the call with children keeps them, the call with
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
 * Create SVG element factory. The tags are put together once, for every
 * element it describes
 * @param tag - Tag name
 * @returns Function to describe given element
 */
/* @__NO_SIDE_EFFECTS__ */
export function createElementFactory<Tag extends ElementName>(
  tag: Tag
) {
  const start = `<${tag}`
  const end = `</${tag}>`

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

      writeSvgElement(start, end, attributes, children)
    }

    return description
  }) as unknown as ElementFactory<Tag>
}
