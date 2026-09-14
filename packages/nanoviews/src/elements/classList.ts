/* oxlint-disable typescript/no-redundant-type-constituents */
import {
  type Signalish,
  $get,
  deferEffect
} from 'kida'
import {
  type FalsyValue,
  createEffectAttribute
} from '../internals/index.js'

export type ClassList = Signalish<string | boolean | FalsyValue>[]

// The parts are read in the loop that joins them, so an update allocates no
// array of values on the way
function cx(parts: ClassList) {
  const len = parts.length
  let cls = ''

  if (len) {
    for (let i = 0, part: unknown; i < len; i++) {
      if ((part = $get(parts[i])) && typeof part === 'string') {
        cls += (cls && ' ') + part
      }
    }
  }

  return cls
}

/**
 * Effect attribute to set class list on element
 */
export const classList$ = /* @__PURE__ */ createEffectAttribute<'classList$', Element, ClassList>(
  'classList$',
  (element, parts) => {
    // `className` is a read-only `SVGAnimatedString` on an SVG element, and
    // assigning it throws in a module; the `class` attribute is the same one
    // in both namespaces
    deferEffect(() => {
      element.setAttribute('class', cx(parts))
    }, true)
  }
)

declare module 'nanoviews' {
  interface EffectAttributeValues<Target extends Element> {
    classList$: ClassList
  }

  interface EffectAttributeTargets {
    classList$: Element
  }
}
