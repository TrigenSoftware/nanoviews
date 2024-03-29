import type { ValueOrStore } from '../internals/index.js'
import {
  isStore,
  createEffectAttribute
} from '../internals/index.js'

/**
 * Effect attribute to set auto focus on element
 */
export const autoFocus$ = createEffectAttribute<'autoFocus', HTMLElement | SVGElement, ValueOrStore<boolean>>(
  (element, $value) => {
    if (isStore($value) && $value.get() || $value) {
      return () => {
        element.focus()
      }
    }
  }
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    [autoFocus$]: ValueOrStore<boolean>
  }

  interface EffectAttributeTargets {
    [autoFocus$]: HTMLElement | SVGElement
  }
}
