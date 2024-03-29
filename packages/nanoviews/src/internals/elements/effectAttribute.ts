import type {
  EffectAttributeId,
  EffectAttributeCallback,
  UnknownAttributes
} from '../types/index.js'
import { toArray } from '../utils.js'

const store = new Map<EffectAttributeId, EffectAttributeCallback>()

/**
 * Create effect attribute
 * @param callback - Effect attribute handler
 * @returns Effect attribute id
 */
export function createEffectAttribute<
  ID extends string,
  TargetElement extends Element,
  Value
>(callback: EffectAttributeCallback<TargetElement, Value>) {
  const id = Symbol()

  /* @__PURE__ */ store.set(id, callback as EffectAttributeCallback)

  // Symbols is better for minification / Constant string type is better for smart types
  return id as unknown as `${ID}$`
}

export function getEffectAttribute(id: EffectAttributeId) {
  return store.get(id)
}

export function isEffectAttribute(id: unknown): id is EffectAttributeId {
  return typeof id === 'symbol' && store.has(id)
}

/**
 * Validate helper for effect attributes
 * @param attributes - Target attributes
 * @param names - Names to check
 * @param effectAttributeName - Effect attribute name
 */
export function effectAttributeValidate<T extends UnknownAttributes>(
  attributes: T,
  names: keyof T | (keyof T)[],
  effectAttributeName: string
) {
  toArray(names).forEach((name) => {
    if (name in attributes) {
      throw new Error(
        `You can't use ${effectAttributeName} effect attribute and ${String(name)} attribute together.`
      )
    }
  })
}
