import type {
  Children,
  LazyChild
} from 'nanoviews'
import { renderChildren } from '../internals/render.js'

function writeFragment(this: Children) {
  renderChildren(this)
}

/**
 * Describe a document fragment with the given children
 * @param children - Children of the fragment
 * @returns Fragment description
 */
/* @__NO_SIDE_EFFECTS__ */
export function fragment(...children: Children) {
  return writeFragment.bind(children) as unknown as LazyChild<() => DocumentFragment>
}
