import type { ClassPart } from 'nanoviews'
import {
  isEmptyAttribute,
  isEventHandler,
  join
} from 'nanoviews/internals'
import {
  type EmptyValue,
  $get,
  isEmpty
} from 'kida'
import { escapeAttribute } from './render.js'

// A name maps to its markup once. A name made from data, `data-${id}` say,
// would grow the map for the life of the process, so it stops growing at a
// size no page reaches with names written in code
const NAMES_LIMIT = 1024

/**
 * Map a name, from the cache when it is there
 * @param names - The cache
 * @param name - The name to map
 * @param map - Function that maps a name
 * @returns The mapped name
 */
export function cachedName(
  names: Map<string, string>,
  name: string,
  map: (name: string) => string
) {
  let mapped = names.get(name)

  if (mapped === undefined) {
    mapped = map(name)

    if (names.size < NAMES_LIMIT) {
      names.set(name, mapped)
    }
  }

  return mapped
}

// The DOM refuses such a name, while in markup it would make attributes of
// its own
export function checkName(name: string) {
  if (/[\s"'/=>]/.test(name)) {
    throw new Error(`Invalid attribute name: ${name}`)
  }

  return name
}

const cssNames = new Map<string, string>()

function toCssName(name: string) {
  return name.startsWith('--')
    ? name
    : name.replace(/[A-Z]/g, '-$&').toLowerCase()
}

function stringifyStyle($style: unknown) {
  const style = $get($style) as Record<string, string | number | EmptyValue> | EmptyValue
  let css = ''

  for (const name in style) {
    const value = style[name]

    // An empty value removes the property, as it does on the client
    if (!isEmpty(value) && value !== '') {
      css += `${css && ';'}${cachedName(cssNames, name, toCssName)}:${value}`
    }
  }

  return css ? ` style="${escapeAttribute(css)}"` : ''
}

// The boolean attributes of HTML, by the names the client takes, to their
// markup: the presence of one is its value, so `true` writes it bare. The
// client sets `"true"`, which reads the same. An enumerated attribute, such
// as `draggable` or an `aria-*` one, keeps `"true"`: there it is the value
const booleanAttributes = new Map([
  ['allowFullScreen', ' allowfullscreen'],
  ['async', ' async'],
  ['autoPlay', ' autoplay'],
  ['capture', ' capture'],
  ['controls', ' controls'],
  ['default', ' default'],
  ['defer', ' defer'],
  ['disabled', ' disabled'],
  ['disablePictureInPicture', ' disablepictureinpicture'],
  ['disableRemotePlayback', ' disableremoteplayback'],
  ['formNoValidate', ' formnovalidate'],
  ['hidden', ' hidden'],
  ['inert', ' inert'],
  ['isMap', ' ismap'],
  ['itemScope', ' itemscope'],
  ['loop', ' loop'],
  ['multiple', ' multiple'],
  ['muted', ' muted'],
  ['noModule', ' nomodule'],
  ['noValidate', ' novalidate'],
  ['open', ' open'],
  ['playsInline', ' playsinline'],
  ['readOnly', ' readonly'],
  ['required', ' required'],
  ['reversed', ' reversed'],
  ['selected', ' selected'],
  ['shadowRootClonable', ' shadowrootclonable'],
  ['shadowRootCustomElementRegistry', ' shadowrootcustomelementregistry'],
  ['shadowRootDelegatesFocus', ' shadowrootdelegatesfocus'],
  ['shadowRootSerializable', ' shadowrootserializable']
])

/**
 * Stringify an attribute the way nanoviews sets it. `ref` has no element
 * to get, `autoFocus` becomes the attribute that focuses on page load,
 * `style` and class lists are serialized, an accessor gives its current
 * value, and a boolean attribute that is on is written bare
 * @param name - Attribute name, as the client sets it
 * @param prefix - What the markup starts with, ` name="`
 * @param $value - Attribute value
 * @returns The markup, empty when there is none
 */
export function stringifyAttribute(name: string, prefix: string, $value: unknown) {
  if (name === 'autoFocus') {
    return $get($value) ? ' autofocus' : ''
  }

  if (name === 'style') {
    return stringifyStyle($value)
  }

  if (name === 'ref') {
    return ''
  }

  const value = name === 'class' && Array.isArray($value)
    ? join($value as ClassPart[])
    : $get($value)

  if (isEmptyAttribute(name, value)) {
    return ''
  }

  if (value === true) {
    const bare = booleanAttributes.get(name)

    if (bare !== undefined) {
      return bare
    }
  }

  return `${prefix}${escapeAttribute(String(value))}"`
}

const htmlPrefixes = new Map<string, string>()

// The DOM lowercases the names set on an HTML element, so the markup has them
// the way the DOM does
function toHtmlPrefix(name: string) {
  return ` ${checkName(name).toLowerCase()}="`
}

/**
 * Stringify the attributes of an HTML element, the event handlers left out.
 * The markup is built here and written at once, with the start tag
 * @param attributes - Element attributes
 * @param consumed - Names the element writes itself
 * @returns The markup
 */
export function stringifyAttributes(attributes: object, consumed?: Set<string>) {
  let markup = ''

  for (const key in attributes) {
    const value = (attributes as Record<string, unknown>)[key]

    if (!isEventHandler(key, value) && consumed?.has(key) !== true) {
      markup += stringifyAttribute(key, cachedName(htmlPrefixes, key, toHtmlPrefix), value)
    }
  }

  return markup
}
