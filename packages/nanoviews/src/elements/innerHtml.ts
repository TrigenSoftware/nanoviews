import type {
  ValueOrStore,
  Block,
  ChildrenBlock
} from '../internals/index.js'
import {
  isFunction,
  isStore,
  addEffects
} from '../internals/index.js'

/**
 * Dangerously set inner HTML to element block
 * @param block - Target element block
 * @param $html - HTML string or store with it
 * @returns Target element block
 */
export function dangerouslySetInnerHtml<
  T extends (Block<Element> | ChildrenBlock<Element>)
>(block: T, $html: ValueOrStore<string>) {
  const sealedBlock = isFunction(block) ? block() : block
  const superMount = sealedBlock.m
  let mount

  if (isStore($html)) {
    mount = (target: Node, anchor?: Node | null) => {
      const element = superMount(target, anchor)

      if (element) {
        element.innerHTML = $html.get()
      }

      return element
    }

    addEffects(element => $html.listen((value) => {
      element.innerHTML = value
    }), sealedBlock)
  } else {
    mount = (target: Node, anchor?: Node | null) => {
      const element = superMount(target, anchor)

      if (element) {
        element.innerHTML = $html
      }

      return element
    }
  }

  sealedBlock.m = mount

  return sealedBlock
}
