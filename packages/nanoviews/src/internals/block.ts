/**
 * Basic block class
 */
export abstract class Block<TNode extends Node = Node> {
  /**
   * Identifier key
   */
  k: unknown
  /**
   * DOM node
   */
  abstract readonly n: TNode | null

  /**
   * Mount block to target
   * @param target - Target to mount to
   * @param anchor - Anchor to mount before
   */
  abstract m(target: Node, anchor?: Node | null): void

  /**
   * Destroy block
   */
  abstract d(): void
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
  readonly n: TNode

  constructor(node: TNode) {
    super()

    this.n = node
  }

  m(target: Node, anchor?: Node | null) {
    target.insertBefore(this.n, anchor!)
  }

  d() {
    const node = this.n

    node.parentNode!.removeChild(node)
  }
}
