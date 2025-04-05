import type { Children } from '../types/index.js'
import { elementChildren } from './element.js'

/**
 * Create fragment
 * @param children
 * @returns Document fragment
 */
export function fragment(...children: Children) {
  const fragment = document.createDocumentFragment()

  return elementChildren.call(
    fragment,
    fragment,
    ...children
  )
}
