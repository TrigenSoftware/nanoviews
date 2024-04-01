import type {
  ValueOrStore,
  ChildrenBlock
} from '../internals/index.js'
import {
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
  T extends Element
>(block: ChildrenBlock<T>, $html: ValueOrStore<string>) {
  const sealedBlock = block()
  const superMount = sealedBlock.m
  const isHtmlStore = isStore($html)

  sealedBlock.m = (target: Node, anchor?: Node | null) => {
    const element = superMount(target, anchor)

    if (element) {
      element.innerHTML = isHtmlStore ? $html.get() : $html
    }

    return element
  }

  if (isHtmlStore) {
    addEffects(element => $html.listen((value) => {
      element.innerHTML = value
    }), sealedBlock)
  }

  return sealedBlock
}
