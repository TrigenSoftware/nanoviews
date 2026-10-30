import { deferEffect } from 'kida'
import {
  type Child,
  mountChild,
  lazyChild,
  fresh
} from '../internals/index.js'

/**
 * Describe a portal: on build the child is mounted into the target instead
 * @param target - Function that returns the target node
 * @param child - Child to mount into the target
 * @returns An empty child
 */
/* @__NO_SIDE_EFFECTS__ */
export function portal(target: () => ParentNode, child: Child) {
  return lazyChild(() => {
    // The server markup has nothing of the child, so it is built fresh
    const unmount = fresh(() => mountChild(target(), child))

    if (unmount !== undefined) {
      deferEffect(() => unmount)
    }
  })
}
