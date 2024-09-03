import type {
  CSSProperties,
  StoresObject,
  PrimitiveAttributeValue
} from '../internals/index.js'
import {
  setProperty,
  createAttributesEffect,
  createEffectAttribute,
  effectAttributeValidate
} from '../internals/index.js'

export type StyleProps = StoresObject<CSSProperties>

function setStyle(
  element: HTMLElement | SVGAElement,
  name: string,
  $value: PrimitiveAttributeValue
) {
  return setProperty(
    value => element.style.setProperty(name, value),
    () => element.style.removeProperty(name),
    $value
  )
}

/**
 * Effect attribute to set style properties on element
 */
export const style$ = /* @__PURE__ */ createEffectAttribute<'style', HTMLElement | SVGAElement, StyleProps>(
  (element, style, attributes) => {
    if (import.meta.env.DEV) {
      effectAttributeValidate(
        attributes,
        'style',
        'style$'
      )
    }

    return createAttributesEffect(element, style, setStyle)
  }
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    [style$]: StyleProps
  }

  interface EffectAttributeTargets {
    [style$]: HTMLElement | SVGAElement
  }
}
