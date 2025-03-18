import type {
  EffectAttributeId,
  EffectAttributeCallback
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
