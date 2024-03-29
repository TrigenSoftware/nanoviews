import type {
  ValueOrStore,
  EmptyValue,
  Block,
  Effect,
  SlotDef,
  PrimitiveChild,
  GetChild,
  GetChildHook
} from '../types/index.js'
import {
  isStore,
  noop,
  isEmpty
} from '../utils.js'
import { createBlockFromBlocks } from '../block.js'
import { childToBlock } from '../elements/index.js'
import { addEffects } from '../logic/index.js'
import { getContextDiftsContainer } from './context.js'
import { createSlot } from './children.js'
import { swap } from './swap.js'

export type PendingSlot = SlotDef<() => PrimitiveChild, 'pending$'>

export type ThenSlot<T> = SlotDef<(value: T) => PrimitiveChild, 'then$'>

export type CatchSlot = SlotDef<(error: unknown) => PrimitiveChild, 'catch$'>

export type EachSlot<T> = SlotDef<(value: T, index: number) => PrimitiveChild, 'each$'>

/**
 * Slot to provide pending state
 */
export const pendingSlot = createSlot<PendingSlot>()

/**
 * Slot to receive and render resolved value
 */
export const thenSlot = createSlot<
  // Type inference doesn't work properly for await$ and forAwait$
  // with `{ i: 'constant id', v: T }` or `Record<'constant id', T>`.
  // Works correctly only with `{ 'constant id': T }`,
  // so we used to use type definition like this.
  {
    <T>(slotContent: (value: T) => PrimitiveChild): {
      then$(value: T): PrimitiveChild
    }
    i: 'then$'
  }
>()

/**
 * Slot to receive and render rejected error
 */
export const catchSlot = createSlot<CatchSlot>()

/**
 * Slot to receive renderer for each value of async iterable
 */
export const eachSlot = createSlot<
  {
    <T>(slotContent: (value: T, index: number) => PrimitiveChild): {
      each$(value: T, index: number): PrimitiveChild
    }
    i: 'each$'
  }
>()

/**
 * Get abort function from AbortController
 * @param $abortController - AbortController or store with it
 * @returns Abort function
 */
export function getAbortFromController(
  $abortController: ValueOrStore<AbortController | EmptyValue>
) {
  return isStore($abortController)
    ? () => $abortController.get()?.abort()
    : $abortController
      ? () => $abortController.abort()
      : noop
}

/**
 * Create host block that can asynchronously render children list
 * @param initialFooter - Initial footer child
 * @param mutator - Mutator callback function
 * @param reverse - Reverse order of children
 * @returns Host block
 */
export function createAsyncList(
  initialFooter: PrimitiveChild,
  mutator: (
    add: GetChildHook,
    setFooter: GetChildHook,
    reset: GetChildHook
  ) => Effect<void> | void,
  reverse?: boolean
) {
  const insertMode = reverse ? 1 : -1
  const [getCurrentContextStack, provideContext] = getContextDiftsContainer()
  const context = getCurrentContextStack()
  let footer: Block | null = childToBlock(initialFooter)
  let blocks: Block[] | null = [footer]
  const add = (getChild: GetChild = noop) => {
    const child = provideContext(context, getChild)

    if (!isEmpty(child)) {
      blocks!.splice(-1, 0, swap(footer!, childToBlock(child), insertMode))
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      proxyBlock.n = blocks![0].n
    }
  }
  const setFooter = (getFooterBlock: GetChild = noop) => {
    const block = childToBlock(provideContext(context, getFooterBlock))

    // eslint-disable-next-line no-multi-assign
    blocks![blocks!.length - 1] = footer = swap(footer!, block)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    proxyBlock.n = blocks![0].n
  }
  const reset = (getFooterBlock?: GetChild) => {
    blocks!.splice(0, blocks!.length - 1).forEach(block => block.d())
    setFooter(getFooterBlock)
  }
  const proxyBlock = addEffects(
    [
      () => mutator(add, setFooter, reset),
      () => () => {
        footer = null
        blocks = null
      }
    ],
    createBlockFromBlocks(() => blocks)
  )

  return proxyBlock
}
