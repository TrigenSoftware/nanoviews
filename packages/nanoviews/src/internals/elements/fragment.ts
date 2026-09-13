import type { Children } from '../types/index.js'
import { lazyChild } from './child.js'
import { appendChildren } from './element.js'

/**
 * Describe a document fragment with the given children
 * @param children - Children of the fragment
 * @returns Fragment description
 */
/* @__NO_SIDE_EFFECTS__ */
export function fragment(...children: Children) {
  return lazyChild(() => appendChildren(document.createDocumentFragment(), children))
}
