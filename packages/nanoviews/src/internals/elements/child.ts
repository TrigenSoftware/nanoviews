import {
  isSignal,
  isFunctionNotSignal
} from 'kida'
import type {
  Child,
  Children,
  Destroy
} from '../types/index.js'
import { isEmpty } from '../utils.js'
import {
  createTextNode,
  createTextNodeFromSignal
} from './text.js'

function childrenForEach(
  children: Children,
  each: (child: ChildNode) => void
): void {
  for (let i = 0, len = children.length; i < len; i++) {
    childForEach(children[i], each)
  }
}

function childForEach(
  child: Child,
  each: (child: ChildNode) => void
): void {
  if (!isEmpty(child)) {
    if (Array.isArray(child)) {
      childrenForEach(child, each)
    } else
      if (isFunctionNotSignal(child)) {
        childForEach(child(), each)
      } else {
        each(
          isSignal(child)
            ? createTextNodeFromSignal(child)
            : typeof child === 'object'
              ? child
              : createTextNode(child)
        )
      }
  }
}

export function childFilter(child: Child) {
  const result: ChildNode[] = []

  childForEach(child, result.push.bind(result))

  if (!result.length) {
    result[0] = createTextNode()
  }

  return result
}

export function mountChild(
  target: ParentNode,
  child: Child
): Destroy {
  const children = childFilter(child)
  const [first] = children
  const last = children[children.length - 1]

  target.append(...children)

  return () => remove(first, last)
}

// used once, inline?
export function appendChildren(
  target: ParentNode | ShadowRoot,
  children: Children
): void {
  childrenForEach(children, target.appendChild.bind(target))
}

// used once, inline? or replace with insertChildBeforeAnchor
export function insertChildrenBeforeAnchor(
  children: Children,
  anchor: ChildNode
): void {
  childrenForEach(children, anchor.before.bind(anchor))
}

export function insertChildBeforeAnchor(
  child: Child,
  anchor: ChildNode
): void {
  childForEach(child, anchor.before.bind(anchor))
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
