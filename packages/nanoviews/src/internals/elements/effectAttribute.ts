import type {
  EffectAttributeId,
  EffectAttributeCallback,
  UnknownAttributes
} from '../types/index.js'

const store = new Map<EffectAttributeId, EffectAttributeCallback>()

/**
 * Create effect attribute
 * @param id - Effect attribute id
 * @param callback - Effect attribute handler
 * @returns Effect attribute id
 */
export function createEffectAttribute<
  ID extends string,
  TargetElement extends Element,
  Value
>(id: ID, callback: EffectAttributeCallback<TargetElement, Value>) {
  store.set(id, callback as EffectAttributeCallback)

  return id
}

/**
 * Get effect attribute by id
 * @param id - Effect attribute id
 * @returns Effect attribute function
 */
export function getEffectAttribute(id: EffectAttributeId) {
  return store.get(id)
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
  (Array.isArray(names) ? names : [names]).forEach((name) => {
    if (name in attributes) {
      throw new Error(
        `You can't use ${effectAttributeName} effect attribute and ${String(name)} attribute together.`
      )
    }
  })
}
