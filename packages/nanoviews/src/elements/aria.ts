import type {
  AriaAttributes,
  PrimitiveAttributeValue
} from '../internals/index.js'
import {
  setProperty,
  createAttributesEffect,
  createEffectAttribute,
  effectAttributeValidate
} from '../internals/index.js'

export type AriaProps = {
  [K in keyof AriaAttributes extends `aria-${infer P}` ? P : never]?: AriaAttributes[`aria-${K}`]
}

function setAriaAttribute(
  element: Element,
  name: string,
  $value: PrimitiveAttributeValue
) {
  const ariaName = `aria-${name}`

  return setProperty(
    value => element.setAttribute(ariaName, value),
    () => element.removeAttribute(ariaName),
    $value
  )
}

/**
 * Effect attribute to set aria attributes on element
 */
export const aria$ = createEffectAttribute<'aria', Element, AriaProps>(
  (element, aria, attributes) => {
    if (import.meta.env.DEV) {
      effectAttributeValidate(
        attributes,
        Object.keys(aria).map(name => `aria-${name}`),
        'aria$'
      )
    }

    return createAttributesEffect(element, aria, setAriaAttribute)
  }
)

declare module 'nanoviews' {
  interface EffectAttributeValues {
    [aria$]: AriaProps
  }

  interface EffectAttributeTargets {
    [aria$]: Element
  }
}
