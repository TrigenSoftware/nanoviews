import type { ValueOrStore, Primitive } from '../types/index.js'
import { isStore, isEmpty } from '../utils.js'
import { createBlockFromNode } from '../block.js'
import { addEffects } from '../logic/index.js'

function getText(value: Primitive) {
  return isEmpty(value) ? '' : `${value}`
}

/**
 * Create a reactive text block
 * @param $value - Reactive or static value
 * @returns Text block
 */
export function createText<T extends Primitive>($value: ValueOrStore<T>) {
  let create
  let effect

  if (isStore($value)) {
    create = () => document.createTextNode(getText($value.get()))
    effect = (node: Text) => $value.listen((value) => {
      node.data = getText(value)
    })
  } else {
    create = () => document.createTextNode(getText($value))
  }

  return addEffects(effect, createBlockFromNode(create))
}
