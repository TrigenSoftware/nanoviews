import type { WritableSignal } from 'kida'
import type { Destroy } from '../internals/index.js'
import {
  $$key,
  $$index,
  $$first,
  $$next,
  $$prev,
  $$destroyEffect,
  $$node,
  $$mount,
  $$destroy
} from './symbols.js'

/**
 * Basic block class
 */
export abstract class Block<TNode extends Node = Node> {
  /**
   * Identifier key
   */
  [$$key]: unknown
  /**
   * Index of block in loop
   */
  [$$index]: WritableSignal<number> | undefined
  /**
   * Children blocks linked list
   */
  [$$first]: Block | undefined
  /**
   * Next sibling block in linked list
   */
  [$$next]: Block | undefined
  /**
   * Previous sibling block in linked list
   */
  [$$prev]: Block | undefined
  /**
   * Effect scope destroy function in loop
   */
  [$$destroyEffect]: Destroy | undefined
  /**
   * DOM node
   */
  abstract readonly [$$node]: TNode | null

  /**
   * Mount block to target
   * @param target - Target to mount to
   * @param anchor - Anchor to mount before
   */
  abstract [$$mount](target: Node, anchor?: Node | null): void

  /**
   * Destroy block
   */
  abstract [$$destroy](): void
}

/**
 * Check if value is block
 * @param value
 * @returns True if value is block
 */
export function isBlock(value: unknown): value is Block {
  return value instanceof Block
}

/**
 * Block with DOM node
 */
export class NodeBlock<TNode extends Node = Node> extends Block<TNode> {
  readonly [$$node]: TNode

  constructor(node: TNode) {
    super()

    this[$$node] = node
  }

  [$$mount](target: Node, anchor?: Node | null) {
    target.insertBefore(this[$$node], anchor!)
  }

  [$$destroy]() {
    const node = this[$$node]

    node.parentNode!.removeChild(node)
  }
}

/**
 * Block that hosts other blocks
 */
export class HostBlock extends Block {
  get [$$node]() {
    return this[$$first]?.[$$node] || null
  }

  [$$mount](target: Node, anchor?: Node | null) {
    mountLinkedBlocks(this[$$first], target, anchor)
  }

  [$$destroy]() {
    destroyLinkedBlocks(this[$$first])
  }
}

export function mountLinkedBlocks(block: Block | undefined, target: Node, anchor?: Node | null) {
  while (block !== undefined) {
    block[$$mount](target, anchor)
    block = block[$$next]!
  }
}

export function destroyLinkedBlocks(block: Block | undefined) {
  while (block !== undefined) {
    block[$$destroy]()
    block = block[$$next]!
  }
}
