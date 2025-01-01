import type { WritableSignal } from 'kida'
import {
  createEffectAttribute,
  addEffect
} from '../internals/index.js'

/**
 * Effect attribute to get element reference
 */
export const ref$ = /* @__PURE__ */ createEffectAttribute<'ref$', Element, WritableSignal<Element | null>>(
  'ref$',
  (element, $ref) => {
    $ref.set(element)

    addEffect(() => () => $ref.set(null))
  }
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    ref$: WritableSignal<Element | null>
  }

  interface EffectAttributeTargets {
    ref$: Element
  }
}
