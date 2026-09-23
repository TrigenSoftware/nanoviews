import {
  type Accessor,
  deferEffect
} from 'kida'
import type {
  EmptyValue,
  Primitive
} from '../types/index.js'
import { isEmpty } from '../utils.js'

// An empty child renders nothing. The booleans are empty next to the nullish
// values, the way a React reader expects: `cond && child` needs no `: null`
export function isEmptyChild(value: unknown): value is EmptyValue | boolean {
  return isEmpty(value) || typeof value === 'boolean'
}

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

  // The body only writes to the DOM, so it is the whole binding
  deferEffect(() => {
    const value = $value()

    node.data = isEmptyChild(value) ? '' : value as string
  }, true)

  return node
}
