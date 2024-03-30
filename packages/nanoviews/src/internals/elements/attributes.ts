import type {
  PrimitiveAttributeValue,
  Primitive,
  TargetEventHandler,
  Effect
} from '../types/index.js'
import {
  isString,
  isFunction,
  isStore,
  isEmpty,
  composeEffects
} from '../utils.js'
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
 * @returns Effect function
 */
export function setProperty(
  set: (value: string) => void,
  unset: () => void,
  $value: PrimitiveAttributeValue
) {
  let listen

  if (isStore($value)) {
    setunset(set, unset, $value.get())
    listen = () => $value.listen(
      value => setunset(set, unset, value)
    )
  } else {
    setunset(set, unset, $value)
  }

  return listen
}

function setAttribute(element: Element, name: string, $value: PrimitiveAttributeValue) {
  const lowerCaseName = name.toLowerCase()

  return setProperty(
    value => element.setAttribute(lowerCaseName, value),
    () => element.removeAttribute(lowerCaseName),
    $value
  )
}

function isEventListener(name: string, value: unknown): value is TargetEventHandler {
  return /^on[A-Z]/.test(name) && isFunction(value)
}

function setEventListener(element: Element, name: string, value: TargetEventHandler) {
  const eventName = name.toLowerCase()

  return () => {
    // @ts-expect-error - Maybe temporary, but it very simple realization
    element[eventName] = value

    return () => {
      // @ts-expect-error - Maybe temporary, but it very simple realization
      element[eventName] = null
    }
  }
}

/**
 * Create attributes effects function
 * @param element - Target element
 * @param attributes - Target attributes
 * @param createAttributeEffect - Function to create effect for each attribute
 * @returns Effect function
 */
export function createAttributesEffect<
  E extends Element,
  T extends Record<string | symbol, unknown>
>(
  element: E,
  attributes: T,
  createAttributeEffect: (
    target: E,
    attributeName: keyof T,
    value: T[keyof T]
  ) => Effect<void> | void
) {
  return composeEffects(
    Reflect.ownKeys(attributes).map(
      (attributeName: keyof T) => createAttributeEffect(element, attributeName, attributes[attributeName])
    )
  )
}

/**
 * Set reactive attributes to element
 * @todo Maybe we can implement validation for dev build
 *       https://github.com/facebook/react/blob/2f8f7760223241665f472a2a9be16650473bce39/packages/react-dom-bindings/src/shared/ReactDOMUnknownPropertyHook.js
 *       https://github.com/facebook/react/blob/2f8f7760223241665f472a2a9be16650473bce39/packages/react-dom-bindings/src/client/ReactDOMComponent.js
 * @param element - Target element
 * @param attributes - Target attributes
 * @returns Effect function
 */
export function setAttributes<A extends object>(element: Element, attributes: A) {
  const { ...tAttributes } = attributes as Attributes

  return composeEffects(
    createAttributesEffect(
      element,
      tAttributes,
      (element, attributeName, value) => {
        const effectAttribute = getEffectAttribute(attributeName)

        if (effectAttribute) {
          return effectAttribute(element, value, tAttributes)
        }
      }
    ),
    createAttributesEffect(
      element,
      tAttributes,
      (element, attributeName, value) => {
        if (isString(attributeName)) {
          return (
            isEventListener(attributeName, value)
              ? setEventListener(element, attributeName, value)
              : setAttribute(element, attributeName, value as PrimitiveAttributeValue)
          )
        }
      }
    )
  )
}
