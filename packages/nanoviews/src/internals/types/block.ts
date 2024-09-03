/**
 * Destroy function
 */
export type Destroy = () => void

/**
 * Effect with required destroy function
 */
export type StrictEffect<T> = (value: T) => Destroy

/**
 * Effect function type
 */
export type Effect<T> = ((value: T) => void) | StrictEffect<T>

/**
 * Create required data
 */
export type CreateBlock = () => void

/**
 * Mount block to target
 * @param target - Target to mount to
 * @param anchor - Anchor to mount before
 * @returns Mounted node
 */
export type MountBlock<T extends Node> = (target: Node, anchor?: Node | null) => T | null

/**
 * Run effects
 */
export type RunEffects = () => void

/**
 * Destroy block
 */
export type DestroyBlock = Destroy

export type GetNode<T extends Node> = () => T | null

/**
 * Symbol to mark object as block
 */
export const isBlockSymbol = Symbol()

/**
 * Component block interface
 */
export interface Block<TNode extends Node = Node> {
  [isBlockSymbol]: true
  /**
   * Key
   */
  k: unknown
  /**
   * Create required data
   */
  c: CreateBlock
  /**
   * Mount block to target
   * @param target - Target to mount to
   * @param anchor - Anchor to mount before
   * @returns Mounted node
   */
  m: MountBlock<TNode>
  /**
   * Run effects
   */
  e: RunEffects
  /**
   * Destroy block
   */
  d: DestroyBlock
  /**
   * Get node
   */
  n: GetNode<TNode>
}

export type PickBlockNode<T extends Block> = T extends Block<infer TNode> ? TNode : never
