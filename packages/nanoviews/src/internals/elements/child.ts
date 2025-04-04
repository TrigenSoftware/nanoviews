import {
  isSignal,
  isFunctionNotSignal
} from 'kida'
import type {
  Child,
  EmptyValue,
  MaybeDestroy
} from '../types/index.js'
import { isEmpty } from '../utils.js'
import {
  createTextNode,
  createTextNodeFromSignal
} from './text.js'

export function childToNode(child: Child) {
  if (isEmpty(child)) {
    return child
  }

  if (isFunctionNotSignal(child)) {
    return childToNode(child())
  }

  return isSignal(child)
    ? createTextNodeFromSignal(child)
    : typeof child === 'object'
      ? child
      : createTextNode(child)
}

export function mountChild(
  target: ParentNode,
  child: Child
): MaybeDestroy {
  const node = childToNode(child)

  if (!isEmpty(node)) {
    if (node.nodeType === 11) {
      const start = node.firstChild
      const end = node.lastChild

      target.appendChild(node)

      return () => remove(start!, end!)
    }

    target.appendChild(node)

    return () => (node as ChildNode).remove()
  }
}

export function insertChildBeforeAnchor(
  child: Child,
  anchor: ChildNode,
  rangeContainer?: { f: ChildNode | EmptyValue, l: ChildNode | EmptyValue }
) {
  const node = childToNode(child)

  if (!isEmpty(node)) {
    anchor.before(node)

    if (rangeContainer !== undefined) {
      if (node.nodeType === 11) {
        rangeContainer.f = node.firstChild!
        rangeContainer.l = node.lastChild!
      } else {
        rangeContainer.f = rangeContainer.l = node as ChildNode
      }
    }
  }
}

export function remove(start: ChildNode, end: Node): void {
  const endNextSibling = end.nextSibling

  while (start !== endNextSibling) {
    const next = start.nextSibling!

    start.remove()
    start = next
  }
}

export function removeBetween(start: Node, end: Node): void {
  remove(start.nextSibling!, end.previousSibling!)
}
