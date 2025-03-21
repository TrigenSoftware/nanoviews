import { isSignal } from 'kida'
import type {
  PrimitiveAttributeValue,
  Primitive,
  TargetEventHandler,
  EffectAttributeCallback
} from '../types/index.js'
import {
  isFunction,
  isEmpty
} from '../utils.js'
import { subscribe } from '../effects.js'
import { getEffectAttribute } from './effectAttribute.js'

type AttributeValue = PrimitiveAttributeValue | TargetEventHandler

type Attributes = Record<string, AttributeValue>

function setunset(
  set: (value: string) => void,
  unset: () => void,
  value: Primitive
) {
  if (isEmpty(value)) {
    unset()
  } else {
    set(value as string)
  }
}

/**
 * Create reactive property setter
 * @param set - Function to set property
 * @param unset - Function to unset property
 * @param $value - Reactive or static value
 */
export function setProperty(
  set: (value: string) => void,
  unset: () => void,
  $value: PrimitiveAttributeValue
) {
  subscribe(
    $value,
    value => setunset(set, unset, value)
  )
}

function setAttribute(element: Element, name: string, $value: PrimitiveAttributeValue) {
  const lowerCaseName = name.toLowerCase()

  setProperty(
    value => element.setAttribute(lowerCaseName, value),
    () => element.removeAttribute(lowerCaseName),
    $value
  )
}

function setEventListener(element: Element, name: string, value: TargetEventHandler) {
  // @ts-expect-error - Maybe temporary, but it very simple realization
  element[name.toLowerCase()] = value
}

/**
 * Set reactive attributes to element
 * @todo Maybe we can implement validation for dev build
 *       https://github.com/facebook/react/blob/2f8f7760223241665f472a2a9be16650473bce39/packages/react-dom-bindings/src/shared/ReactDOMUnknownPropertyHook.js
 *       https://github.com/facebook/react/blob/2f8f7760223241665f472a2a9be16650473bce39/packages/react-dom-bindings/src/client/ReactDOMComponent.js
 * @param element - Target element
 * @param attributes - Target attributes
 */
export function setAttributes<A extends object>(element: Element, attributes: A) {
  const keys = Object.keys(attributes)
  const len = keys.length
  let tEffectAttr: EffectAttributeCallback | undefined

  if (len) {
    for (let i = 0, key: string, value: AttributeValue; i < len; i++) {
      key = keys[i]
      value = (attributes as Attributes)[key]

      if (tEffectAttr = getEffectAttribute(key)) {
        tEffectAttr(element, value, attributes as Attributes)
      } else if (isSignal(value)) {
        setAttribute(element, key, value)
      } else if (isFunction(value)) {
        setEventListener(element, key, value)
      } else {
        setAttribute(element, key, value)
      }
    }
  }
}
