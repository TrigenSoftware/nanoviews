import { isSignal } from 'kida'
import type {
  PrimitiveChild,
  Children
} from '../types/index.js'
import {
  $$first,
  $$prev,
  $$next
} from '../symbols.js'
import {
  isFunction,
  isEmpty
} from '../utils.js'
import {
  type Block,
  isBlock
} from '../block.js'
import { createText } from './text.js'

/**
 * Convert child to block
 * @param child - Child
 * @returns Block
 */
export function childToBlock(child: PrimitiveChild) {
  return (
    isSignal(child)
      ? createText(child)
      : isFunction(child)
        ? child()
        : isBlock(child)
          ? child
          : createText(child)
  )
}

export function forEachChild(
  children: Children,
  callback: (block: Block) => void
): void {
  for (let i = 0, len = children.length, child: Children[number]; i < len; i++) {
    child = children[i]

    if (Array.isArray(child)) {
      forEachChild(child, callback)
    } else if (!isEmpty(child)) {
      callback(childToBlock(child))
    }
  }
}

export function linkChild(
  parent: Block,
  prev: Block | undefined,
  next: Block | undefined,
  insert?: Block | undefined
): void {
  if (prev === undefined) {
    parent[$$first] = insert || next
  } else {
    prev[$$next] = insert || next
  }

  if (next !== undefined) {
    next[$$prev] = insert || prev
  }
}

export function linkChildren(
  parent: Block,
  children: Children
): void {
  let prevBlock: Block | undefined

  forEachChild(children, (block) => {
    linkChild(parent, prevBlock, block)
    prevBlock = block
  })
}
