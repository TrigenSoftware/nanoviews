import type { PrimitiveAttributeValue } from '../internals/index.js'
import {
  setProperty,
  createAttributesEffect,
  createEffectAttribute,
  effectAttributeValidate
} from '../internals/index.js'

export type DataProps = Record<string, PrimitiveAttributeValue>

function setData(
  element: HTMLElement | SVGElement,
  name: string,
  $value: PrimitiveAttributeValue
) {
  return setProperty(
    (value) => {
      element.dataset[name] = value
    },
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset#setting_values
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    () => delete element.dataset[name],
    $value
  )
}

/**
 * Effect attribute to set data attributes on element
 */
export const data$ = /* @__PURE__ */ createEffectAttribute<'data', HTMLElement | SVGElement, DataProps>(
  (element, data, attributes) => {
    if (import.meta.env.DEV) {
      effectAttributeValidate(
        attributes,
        Object.keys(data).map(name => `data-${name}`),
        'data$'
      )
    }

    if (data) {
      return createAttributesEffect(element, data, setData)
    }
  }
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    [data$]: DataProps
  }

  interface EffectAttributeTargets {
    [data$]: HTMLElement | SVGElement
  }
}
