import type {
  Child,
  LazyChild
} from 'nanoviews'
import { noop } from 'kida'

/**
 * Describe a portal. Its target is a node, and there is none on the server:
 * the portal writes nothing in place, as on the client, and the child is
 * mounted into the target on the client
 * @param target - Function that returns the target node
 * @param child - Child to mount into the target
 * @returns An empty child
 */
export function portal(target: () => ParentNode, child: Child): LazyChild<() => undefined>

export function portal() {
  return noop as LazyChild<() => undefined>
}
