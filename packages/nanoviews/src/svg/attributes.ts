import {
  type PrimitiveAttributeValue,
  type TargetEventHandler,
  isEventHandler,
  setEventListener,
  setAttribute,
  toSvgAttributeName
} from '../internals/index.js'

type AttributeValue = PrimitiveAttributeValue | TargetEventHandler

type Attributes = Record<string, AttributeValue>

// Mapped once per prop name: the lookup is a property read, and the same
// string object is handed to `setAttribute` every time
const attributeNames: Record<string, string> = {}

/**
 * Set reactive attributes to SVG element
 * @param element - Target element
 * @param attributes - Target attributes
 */
export function setAttributes<A extends object>(element: Element, attributes: A) {
  for (const key in attributes) {
    const value = (attributes as Attributes)[key]

    if (isEventHandler(key, value)) {
      setEventListener(element, key, value)
    } else {
      setAttribute(element, attributeNames[key] ??= toSvgAttributeName(key), value)
    }
  }
}
