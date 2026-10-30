import type {
  Child,
  Children,
  MaybeDestroy
} from '../types/index.js'
import {
  type Instructions,
  type RangeContainer,
  childToNode,
  setInstructions
} from './dom.js'
import { remove } from './child.js'

// The node the build takes next, and the node that holds it. Every node
// taken moves the build past it, so the markup is walked once, in order
let cursor: ChildNode | null
let parent: ParentNode
// The ends of the blocks the build is in, the innermost last: a block finds
// its end as it starts, and the build steps past it once the content is in
let ends: ChildNode[]
// The instructions of a build that makes its nodes, for what the markup
// has no part of
let instructions: Instructions

function mismatch(): never {
  throw import.meta.env.DEV
    ? new Error('The markup to hydrate does not match the view')
    : new Error()
}

// Step past the ends of the blocks started since the depth
function close(depth: number) {
  while (ends.length > depth) {
    cursor = ends.pop()!.nextSibling
  }
}

function takeElement(tag: string) {
  const node = cursor as Element | null

  if (node?.localName !== tag) {
    mismatch()
  }

  cursor = node.nextSibling

  return node
}

function takeText(value: unknown = '') {
  const text = String(value)
  let node = cursor as Text | null

  // An empty text has no node in the markup: it is made in place
  if (!text) {
    parent.insertBefore(node = document.createTextNode(text), cursor)

    return node
  }

  if (node?.nodeType !== 3) {
    mismatch()
  }

  // Texts next to each other are one node in the markup: it is cut where
  // this one ends
  if (node.data.length > text.length) {
    node.splitText(text.length)
  }

  cursor = node.nextSibling

  return node
}

function takeEach(children: Children) {
  for (let i = 0, len = children.length, depth; i < len; i++) {
    depth = ends.length
    childToNode(children[i])
    close(depth)
  }
}

function takeChildren<T extends ParentNode>(target: T, children: Children | undefined) {
  if (children !== undefined) {
    // A fragment made here has no node in the markup, so its children stand
    // in its place. An element or a shadow root is entered, unless it is
    // empty, as a declarative shadow root is once attached, and then its
    // children are built
    if (target.nodeType === 11 && !('host' in target)) {
      takeEach(children)
    } else if (target.firstChild === null) {
      buildFresh(() => instructions[3](target, children))
    } else {
      const outer = parent
      const next = cursor

      parent = target
      cursor = target.firstChild
      takeEach(children)
      parent = outer
      cursor = next
    }
  }

  return target
}

function takeBeforeAnchor(
  child: Child,
  _anchor: ChildNode,
  rangeContainer?: RangeContainer
) {
  // A node made just before, as the place holder of an empty row, is in
  // place already
  if (typeof child === 'object' && child !== null) {
    rangeContainer!.f = rangeContainer!.l = child as ChildNode

    return
  }

  // A block or a row always has its end after it, so there is a node before
  // what it takes and one after
  const prev = cursor!.previousSibling!
  const depth = ends.length

  childToNode(child)
  close(depth)

  if (rangeContainer !== undefined && prev.nextSibling !== cursor) {
    rangeContainer.f = prev.nextSibling
    rangeContainer.l = cursor!.previousSibling
  }
}

function takeBlock(): [DocumentFragment, ChildNode, ChildNode] {
  // A child can build its blocks one after another, as `show_switch_` builds
  // the blocks of its cases: the next one starts past the end of the last
  if (cursor === ends[ends.length - 1]) {
    cursor = ends.pop()!.nextSibling
  }

  const start = cursor as Comment | null

  if (start?.nodeType !== 8 || start.data !== '[') {
    mismatch()
  }

  let end = start.nextSibling as Comment

  // The end is the `]` that closes this `[`, past the blocks in it
  for (let depth = 0; ; end = end.nextSibling as Comment) {
    if (end.nodeType === 8) {
      if (end.data === '[') {
        depth++
      } else if (end.data === ']' && !depth--) {
        break
      }
    }
  }

  ends.push(end)
  cursor = start.nextSibling

  return [document.createDocumentFragment(), start, end]
}

function buildFresh<T>(build: () => T) {
  const taking = setInstructions(instructions)

  try {
    return build()
  } finally {
    setInstructions(taking)
  }
}

/**
 * Build a child from the nodes of the markup in the target instead of making
 * them: they get the bindings, handlers and effects of the child
 * @param target - The node that holds the markup
 * @param child - Child the markup was rendered from
 * @returns A function to remove the nodes of the child
 */
export function hydrateChild(target: ParentNode, child: Child): MaybeDestroy {
  instructions = setInstructions([
    takeElement,
    takeElement,
    takeText,
    takeChildren,
    takeBeforeAnchor,
    takeBlock,
    buildFresh
  ])
  parent = target
  cursor = target.firstChild
  ends = []

  try {
    childToNode(child)
    close(0)
  } finally {
    setInstructions(instructions)
  }

  const first = target.firstChild

  if (first !== cursor) {
    const last = cursor === null ? target.lastChild! : cursor.previousSibling!

    return () => remove(first!, last)
  }
}
