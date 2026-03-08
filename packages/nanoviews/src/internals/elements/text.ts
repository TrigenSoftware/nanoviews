import {
  type Accessor,
  subscribe
} from 'kida'
import type { Primitive } from '../types/index.js'
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

  subscribe($value, value => node.data = isEmpty(value) ? '' : value as string, true)

  return node
}
