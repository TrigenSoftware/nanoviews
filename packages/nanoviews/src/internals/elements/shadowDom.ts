import type { Children } from '../types/index.js'
import { FragmentBlock } from './fragment.js'

export class ShadowBlock extends FragmentBlock {
  readonly #options: ShadowRootInit

  constructor(
    children: Children,
    options: ShadowRootInit
  ) {
    super(children)
    this.#options = options
  }

  override m(parentNode: Element) {
    super.m(parentNode.attachShadow(this.#options))
  }
}
