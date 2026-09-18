import {
  isAccessor,
  deferEffect
} from 'kida'
import type {
  CSSProperties,
  EmptyValue,
  StyleValue
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
  value: string | number | undefined
) {
  const cssValue = (value ?? '') as string

  if (name.startsWith('--')) {
    style.setProperty(name, cssValue)
  } else {
    style[name] = cssValue
  }
}

function setStyleValues(
  style: StyleDeclaration,
  values: CSSProperties | EmptyValue
) {
  for (const name in values) {
    setStyleValue(style, name, values[name as keyof CSSProperties])
  }
}

/**
 * Set the style of an element: an object once, an accessor as it changes
 * @param element - Target element
 * @param $style - Style properties, camelCased, or an accessor of them
 */
export function setStyle(
  element: HTMLElement | SVGElement,
  $style: StyleValue
) {
  const style = element.style as StyleDeclaration

  if (isAccessor($style)) {
    let prev: CSSProperties | EmptyValue

    deferEffect(() => {
      const next = $style()

      // A property the new object no longer names is dropped, the rest are
      // written over
      for (const name in prev) {
        if (next?.[name as keyof CSSProperties] === undefined) {
          setStyleValue(style, name, '')
        }
      }

      setStyleValues(style, next)
      prev = next
    }, true)
  } else {
    setStyleValues(style, $style)
  }
}
