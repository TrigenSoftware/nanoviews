import type { Children } from '../types/index.js'
import { $$mount } from '../symbols.js'
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

  override [$$mount](parentNode: Element) {
    super[$$mount](parentNode.attachShadow(this.#options))
  }
}
