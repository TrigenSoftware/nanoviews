import type { Accessor } from 'kida'
import type { Primitive } from '../types/index.js'
import { subscribeAccessor } from '../effects.js'
import { isEmpty } from '../utils.js'

export function createTextNode(value: unknown = '') {
  return document.createTextNode(value as string)
}

/**
 * Create a reactive text node
 * @param $value - Reactive or static value
 * @returns Text node
 */
export function createTextNodeFromAccessor<T extends Primitive>($value: Accessor<T>) {
  const node = createTextNode()

  subscribeAccessor($value, value => node.data = isEmpty(value) ? '' : value as string)

  return node
}
