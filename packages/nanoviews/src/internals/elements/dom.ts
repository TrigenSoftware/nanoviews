/* oxlint-disable import/no-mutable-exports */
import {
  type Accessor,
  isFunction,
  deferEffect
} from 'kida'
import type {
  Child,
  Children,
  EmptyValue,
  Primitive
} from '../types/index.js'
import { isEmptyChild } from './text.js'

// The instructions a build goes through to make its nodes and put them in
// place. `hydrate` swaps them for ones that take the nodes of the server
// markup instead: a bundle that never hydrates keeps these bindings and
// nothing of hydration

export interface RangeContainer {
  f: ChildNode | EmptyValue
  l: ChildNode | EmptyValue
}

export type Instructions = [
  createHtmlElement: typeof createHtmlElement,
  createSvgElement: typeof createSvgElement,
  createTextNode: typeof createTextNode,
  appendChildren: typeof appendChildren,
  insertChildBeforeAnchor: typeof insertChildBeforeAnchor,
  createBlock: typeof createBlock,
  fresh: typeof fresh
]

export let createHtmlElement = (tag: string): Element => document.createElement(tag)

export let createSvgElement = (tag: string): Element => document.createElementNS('http://www.w3.org/2000/svg', tag)

export let createTextNode = (value: unknown = '') => document.createTextNode(value as string)

/**
 * Create a reactive text node
 * @param $value - Reactive or static value
 * @returns Text node
 */
export function createTextNodeFromAccessor<T extends Primitive>($value: Accessor<T>) {
  let node: Text | undefined

  // The body only writes to the DOM, so it is the whole binding. The first
  // run makes the node with the text it starts with, by which hydration
  // finds it in the markup
  deferEffect(() => {
    const value = $value()
    const text = isEmptyChild(value) ? '' : value as string

    if (node) {
      node.data = text
    } else {
      node = createTextNode(text)
    }
  }, true)

  return node!
}

export function childToNode(child: Child) {
  // A function is the common child, a description most of all, and it is
  // never empty, so it is asked about first. A description unwraps in place
  // rather than through a call per level: a component that returns an element
  // that returns a fragment is three levels. The brand test is that of
  // `isLazyChild`, spelled out to skip its own function check
  while (isFunction(child)) {
    if (!('c' in child)) {
      return createTextNodeFromAccessor(child)
    }

    child = child()
  }

  return isEmptyChild(child)
    ? undefined
    : typeof child === 'object'
      ? child
      : createTextNode(child)
}

/**
 * Build the children, if any, and append them to a node
 * @param target - Parent node
 * @param children - Children to append
 * @returns The parent node
 */
export let appendChildren = <T extends ParentNode>(target: T, children: Children | undefined) => {
  if (children !== undefined) {
    for (let i = 0, len = children.length, node: ChildNode | DocumentFragment | EmptyValue; i < len; i++) {
      if (node = childToNode(children[i])) {
        target.appendChild(node)
      }
    }
  }

  return target
}

export let insertChildBeforeAnchor = (
  child: Child,
  anchor: ChildNode,
  rangeContainer?: RangeContainer
) => {
  const node = childToNode(child)

  if (node) {
    if (rangeContainer !== undefined) {
      if (node.nodeType === 11) {
        rangeContainer.f = node.firstChild!
        rangeContainer.l = node.lastChild!
      } else {
        rangeContainer.f = rangeContainer.l = node as ChildNode
      }
    }

    anchor.before(node)
  }
}

// The ends of a block in a fragment that puts them in place: the content of
// the block goes between them
export let createBlock = (): [DocumentFragment, ChildNode, ChildNode] => {
  const start = createTextNode()
  const end = createTextNode()
  const fragment = document.createDocumentFragment()

  fragment.append(start, end)

  return [fragment, start, end]
}

// A build of nodes the server markup has no part of, such as the content of
// a hidden `show_` or of a portal
export let fresh = <T>(build: () => T) => build()

/**
 * Swap the instructions of the build
 * @param instructions - The instructions to build with
 * @returns The instructions the build went through before
 */
export function setInstructions(instructions: Instructions): Instructions {
  const prev: Instructions = [
    createHtmlElement,
    createSvgElement,
    createTextNode,
    appendChildren,
    insertChildBeforeAnchor,
    createBlock,
    fresh
  ]

  createHtmlElement = instructions[0]
  createSvgElement = instructions[1]
  createTextNode = instructions[2]
  appendChildren = instructions[3]
  insertChildBeforeAnchor = instructions[4]
  createBlock = instructions[5]
  fresh = instructions[6]

  return prev
}
