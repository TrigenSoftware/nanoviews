import { setAttribute as setElementAttribute } from '../internals/index.js'

// The props are camelCase throughout, the React way, while SVG spells its
// presentation attributes like the CSS properties they are, `stroke-width`,
// and everything else as is, `viewBox`. The presentation attributes come in
// families sharing a prefix or a suffix; the three families with a camelCase
// sibling (`markerWidth`, `textLength`, `clipPathUnits`) are matched in full
const hyphenated = /^(?:stroke|fill|font|flood|stop|lighting|color|marker(?:End|Mid|Start)|text(?:Anchor|Decoration)|clip(?:Path|Rule)$|paintOrder|pointerEvents|unicodeBidi|vectorEffect|writingMode|baselineShift)|(?:Rendering|Spacing|Baseline)$/
// Mapped once per prop name: the lookup is a property read, and the same
// string object is handed to `setAttribute` every time
const attributeNames: Record<string, string> = {}

function toAttributeName(name: string) {
  return hyphenated.test(name)
    ? name.replace(/[A-Z]/g, '-$&').toLowerCase()
    : name === 'tabIndex' || name === 'crossOrigin'
      ? name.toLowerCase()
      : name
}

/**
 * Set an attribute of an SVG element under its SVG name
 * @param element - Target element
 * @param name - Attribute name, camelCased
 * @param value - Attribute value
 */
export function setAttribute(element: Element, name: string, value: unknown) {
  setElementAttribute(element, attributeNames[name] ??= toAttributeName(name), value)
}
