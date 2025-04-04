import { effect } from 'kida'
import {
  type Child,
  mountChild
} from '../internals/index.js'

/**
 * Render child in the target node
 * @param target
 * @param child
 */
export function portal$(target: () => ParentNode, child: Child) {
  const unmount = mountChild(target(), child)

  if (unmount !== undefined) {
    effect(() => unmount)
  }
}
