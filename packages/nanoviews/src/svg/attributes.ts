import {
  type PrimitiveAttributeValue,
  type TargetEventHandler,
  effectAttributes,
  isEventHandler,
  setEventListener,
  setAttribute
} from '../internals/index.js'

type AttributeValue = PrimitiveAttributeValue | TargetEventHandler

type Attributes = Record<string, AttributeValue>

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
 * Set reactive attributes to SVG element
 * @param element - Target element
 * @param attributes - Target attributes
 */
export function setAttributes<A extends object>(element: Element, attributes: A) {
  for (const key in attributes) {
    const value = (attributes as Attributes)[key]
    const tEffectAttr = effectAttributes?.get(key)

    if (tEffectAttr !== undefined) {
      tEffectAttr(element, value, attributes as Attributes)
    } else if (isEventHandler(key, value)) {
      setEventListener(element, key, value)
    } else {
      setAttribute(element, attributeNames[key] ??= toAttributeName(key), value)
    }
  }
}
