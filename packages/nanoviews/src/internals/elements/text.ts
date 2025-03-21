import type {
  ValueOrSignal,
  Primitive
} from '../types/index.js'
import { subscribe } from '../effects.js'
import { isEmpty } from '../utils.js'
import { NodeBlock } from '../block.js'

function getText(value: Primitive) {
  return isEmpty(value) ? '' : `${value}`
}

/**
 * Create a reactive text block
 * @param $value - Reactive or static value
 * @returns Text block
 */
export function createText<T extends Primitive>($value: ValueOrSignal<T>) {
  const node = document.createTextNode('')
  const block = new NodeBlock(node)

  subscribe($value, value => node.data = getText(value))

  return block
}
