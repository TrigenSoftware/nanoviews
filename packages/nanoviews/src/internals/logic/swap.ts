import type {
  Block,
  Destroy,
  PrimitiveChild,
  GetChild,
  GetChildHook
} from '../types/index.js'
import { noop } from '../utils.js'
import { createBlock } from '../block.js'
import { childToBlock } from '../elements/index.js'
import { getContextDiftsContainer } from './context.js'

/**
 * Swap blocks
 * @param prevBlock - Previous block
 * @param nextBlock - Next block
 * @param insertOnly - Insert next block without removing previous block
 * @returns Next block
 */
export function swap(
  prevBlock: Block,
  nextBlock: Block,
  insertOnly?: boolean
) {
  if (prevBlock === nextBlock) {
    return prevBlock
  }

  const anchor = prevBlock.n

  nextBlock.c()
  nextBlock.m(anchor!.parentNode!, anchor)

  if (!insertOnly) {
    prevBlock.d()
  }

  nextBlock.e()

  return nextBlock
}

/**
 * Create host block that can swap its child
 * @param initial - Initial child
 * @param swapper - Swapper callback function
 * @returns Host block
 */
export function createSwapper(
  initial: PrimitiveChild,
  swapper: (swap: GetChildHook) => Destroy | void
) {
  const [getCurrentContextStack, provideContext] = getContextDiftsContainer()
  const context = getCurrentContextStack()
  let childBlock: Block | null = childToBlock(initial)
  const swapNextBlock = (getNextChild: GetChild = noop) => {
    childBlock = swap(
      childBlock!,
      childToBlock(provideContext(context, getNextChild))
    )
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    proxyBlock.n = childBlock.n
  }
  const proxyBlock = createBlock(
    () => {
      childBlock!.c()
    },
    (node, anchor) => childBlock!.m(node, anchor),
    () => {
      childBlock!.e()

      return swapper(swapNextBlock)
    },
    () => {
      childBlock!.d()
      childBlock = null
    }
  )

  return proxyBlock
}
