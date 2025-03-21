import {
  isSignal,
  effect
} from 'kida'
import {
  type ValueOrSignal,
  createEffectAttribute
} from '../internals/index.js'

/**
 * Effect attribute to set auto focus on element
 */
export const autoFocus$ = /* @__PURE__ */ createEffectAttribute<'autoFocus$', HTMLElement | SVGElement, ValueOrSignal<boolean>>(
  'autoFocus$',
  (element, $value) => {
    if (isSignal($value) && $value() || $value) {
      effect(() => {
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
