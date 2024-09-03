import type { Store } from '../internals/index.js'
import { createEffectAttribute } from '../internals/index.js'

/**
 * Effect attribute to get element reference
 */
export const ref$ = /* @__PURE__ */ createEffectAttribute<'ref', Element, Store<Element | null>>(
  (element, $ref) => () => {
    $ref.set(element)

    return () => $ref.set(null)
  }
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    [ref$]: Store<Element | null>
  }

  interface EffectAttributeTargets {
    [ref$]: Element
  }
}
