import type { ReadableSignal } from 'kida'
import type { Primitive } from '../types/index.js'
import { subscribeSignal } from '../effects.js'
import { isEmpty } from '../utils.js'

export function createTextNode(value: unknown = '') {
  return document.createTextNode(value as string)
}

/**
 * Create a reactive text node
 * @param $value - Reactive or static value
 * @returns Text node
 */
export function createTextNodeFromSignal<T extends Primitive>($value: ReadableSignal<T>) {
  const node = createTextNode()

  subscribeSignal($value, value => node.data = isEmpty(value) ? '' : value as string)

  return node
}
