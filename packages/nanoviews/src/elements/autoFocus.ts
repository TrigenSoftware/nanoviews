import { isSignal } from 'kida'
import {
  type ValueOrSignal,
  createEffectAttribute,
  addEffect
} from '../internals/index.js'

/**
 * Effect attribute to set auto focus on element
 */
export const autoFocus$ = /* @__PURE__ */ createEffectAttribute<'autoFocus$', HTMLElement | SVGElement, ValueOrSignal<boolean>>(
  'autoFocus$',
  (element, $value) => {
    if (isSignal($value) && $value.get() || $value) {
      addEffect(() => {
        element.focus()
      })
    }
  }
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    autoFocus$: ValueOrSignal<boolean>
  }

  interface EffectAttributeTargets {
    autoFocus$: HTMLElement | SVGElement
  }
}
