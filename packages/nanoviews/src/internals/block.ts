import type {
  EmptyValue,
  Block,
  CreateBlock,
  MountBlock,
  Effect,
  Destroy,
  DestroyBlock
} from './types/index.js'
import { isBlockSymbol } from './types/block.js'
import { isFunction } from './utils.js'

export { isBlockSymbol }

export function isBlock(value: unknown): value is Block {
  return !!(value as Block)?.[isBlockSymbol]
}

/**
 * Create block base object
 * @param create - Function to create required data
 * @param mount - Function to mount block to target
 * @param effect - Function to run effects
 * @param destroy - Function to destroy block
 * @returns Block object
 */
export function createBlock<TNode extends Node>(
  create: CreateBlock,
  mount: MountBlock<TNode>,
  effect: Effect<void>,
  destroy: DestroyBlock
) {
  let destroyEffect: Destroy | EmptyValue
  const block: Block<TNode> = {
    [isBlockSymbol]: true,
    k: null,
    n: null,
    c: create,
    m(node, anchor) {
      block.n = mount(node, anchor)

      return block.n
    },
    e() {
      destroyEffect = effect()
    },
    d() {
      destroyEffect?.()
      destroy()
      destroyEffect = null
      block.k = null
      block.n = null
    }
  }

  return block
}

/**
 * Create lazy block
 * @param getBlock - Function to get block
 * @returns Lazy block
 */
export function createLazyBlock<TNode extends Node>(getBlock: () => Block<TNode>) {
  let block: Block<TNode> | null

  return createBlock<TNode>(
    () => {
      block = getBlock()
      block.c()
    },
    (parentNode, anchor) => block!.m(parentNode, anchor) || null,
    () => block!.e(),
    () => {
      block!.d()
      block = null
    }
  )
}

/**
 * Create block from node
 * @param create - Function to create node
 * @param childBlock - Children block
 * @returns Block object
 */
export function createBlockFromNode<TNode extends Node>(
  create: () => TNode,
  childBlock?: Block
) {
  let node: TNode | null

  return createBlock(
    () => {
      node = create()
      childBlock?.c()
    },
    (parentNode, anchor) => {
      childBlock?.m(node!)
      parentNode.insertBefore(node!, anchor || null)
      return node!
    },
    () => childBlock?.e(),
    () => {
      childBlock?.d()
      node!.parentNode?.removeChild(node!)
      node = null
    }
  )
}

type BlockOrGetter = (() => Block[] | EmptyValue) | Block[] | EmptyValue

function getBlocks(blocksOrGetter: BlockOrGetter) {
  return isFunction(blocksOrGetter) ? blocksOrGetter() : blocksOrGetter
}

function createBlocksLifesycle(
  blocksOrGetter: BlockOrGetter,
  lifecycle: (block: Block) => void
) {
  return () => getBlocks(blocksOrGetter)?.forEach(lifecycle)
}

function createBlocksMount(blocksOrGetter: BlockOrGetter) {
  return (parentNode: Node, anchor?: Node | null | undefined) => {
    getBlocks(blocksOrGetter)?.forEach(block => block.m(parentNode, anchor))

    return parentNode.firstChild as Node
  }
}

/**
 * Create block from blocks or blocks getter
 * @param blocksOrGetter - Blocks or blocks getter function
 * @returns Block of blocks
 */
export function createBlockFromBlocks(blocksOrGetter: BlockOrGetter) {
  return createBlock(
    createBlocksLifesycle(blocksOrGetter, block => block.c()),
    createBlocksMount(blocksOrGetter),
    createBlocksLifesycle(blocksOrGetter, block => block.e()),
    createBlocksLifesycle(blocksOrGetter, block => block.d())
  )
}
