import {
  isAccessor,
  deferEffect
} from 'kida'
import type {
  StyleProps,
  PrimitiveAttributeValue,
  Primitive
} from '../types/index.js'

// Every camelCased CSS property is a real writable property of
// `CSSStyleDeclaration`, but it declares no string index signature
type StyleDeclaration = CSSStyleDeclaration & Record<string, string>

// `CSSProperties` is camelCased, while `setProperty` matches its argument
// against the hyphenated CSS property names only and silently drops
// everything else, so the assignment is the writer that accepts the names the
// object is typed with - except for custom properties, which the assignment
// does not see at all. An empty value removes the property either way, so
// there is nothing to branch on
function setStyleValue(
  style: StyleDeclaration,
  name: string,
  value: Primitive
) {
  const cssValue = value as string ?? ''

  if (name.startsWith('--')) {
    style.setProperty(name, cssValue)
  } else {
    style[name] = cssValue
  }
}

function setStyleProperty(
  style: StyleDeclaration,
  name: string,
  $value: PrimitiveAttributeValue
) {
  if (isAccessor($value)) {
    deferEffect(() => {
      setStyleValue(style, name, $value())
    }, true)
  } else {
    setStyleValue(style, name, $value)
  }
}

/**
 * Set the style properties of an element: a static one once, an accessor as
 * it changes
 * @param element - Target element
 * @param styles - Style properties, camelCased
 */
export function setStyle(element: HTMLElement | SVGElement, styles: StyleProps) {
  const style = element.style as StyleDeclaration

  for (const name in styles) {
    setStyleProperty(style, name, styles[name as keyof StyleProps])
  }
}
