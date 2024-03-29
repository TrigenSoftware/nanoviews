import {
  createLazyBlock,
  isBlockSymbol
} from '../block.js'
import type {
  Block,
  Children,
  ChildrenWithSlots,
  SlotId,
  Slot,
  SlotDef,
  AnySlotDef,
  MapSlotDefsToContents,
  MapSlotDefsToSlot,
  SlotsSplitter,
  Renderer,
  RendererWithSlots,
  ChildrenBlock,
  ChildrenBlockWithSlots
} from '../types/index.js'

const isSlotSymbol = Symbol()

/**
 * Check if value is a slot
 * @param value
 * @returns Is a slot
 */
export function isSlot(value: unknown): value is Slot<unknown> {
  return !!(value as Slot<unknown>)?.[isSlotSymbol]
}

export function createSlot<S extends AnySlotDef>(): S

export function createSlot<C = Block, I extends SlotId = SlotId>(): SlotDef<C, I>

/**
 * Create slot definition
 * @returns Slot definition
 */
export function createSlot() {
  const id: symbol = Symbol()
  const slotDef = (slotContent: unknown) => {
    const slot = {
      [isSlotSymbol]: true as const,
      [id]: slotContent
    }

    if (import.meta.env.DEV) {
      Object.defineProperty(slot, isBlockSymbol, {
        get() {
          throw new Error('Slot cannot be used as a block')
        }
      })
    }

    return slot
  }

  slotDef.i = id

  return slotDef
}

/**
 * Define slots in children
 * @param slotDefs - Slot definitions
 * @returns Slots splitter
 */
export function createSlotsSplitter<D extends AnySlotDef[]>(...slotDefs: [...D]): SlotsSplitter<D> {
  return (children) => {
    const slots = Array(slotDefs.length) as unknown[]
    const restChildren: Children = []

    children.forEach((child) => {
      if (isSlot(child)) {
        let content: unknown
        const slotIndex = slotDefs.findIndex((slot) => {
          content = child[slot.i]

          return content
        })

        if (slotIndex > -1) {
          slots[slotIndex] = content
        } else if (import.meta.env.DEV) {
          throw new Error('Unexpected slot')
        }

        return
      }

      restChildren.push(child)
    })

    return [slots as MapSlotDefsToContents<D>, restChildren]
  }
}

/**
 * Create children setter for a component
 * @param renderer - Component blocks renderer
 * @returns Component block with children setter
 */
export function getChildren<
  TNode extends Node
>(
  renderer: Renderer<TNode>
): ChildrenBlock<TNode>

/**
 * Create children setter for a component with slots
 * @param slotsSplitter - Slots splitter
 * @param renderer - Component blocks renderer with slots
 * @returns Component block with children setter
 */
export function getChildren<
  D extends AnySlotDef[],
  TNode extends Node
>(
  slotsSplitter: SlotsSplitter<D>,
  renderer: RendererWithSlots<D, TNode>
): ChildrenBlockWithSlots<D, TNode>

export function getChildren<
  D extends AnySlotDef[],
  TNode extends Node
>(
  slotsSplitterOrRender: SlotsSplitter<D> | Renderer<TNode>,
  maybeRender?: RendererWithSlots<D, TNode>
) {
  type AnyRenderer = (...args: unknown[]) => Block<TNode>

  const [slotsSplitter, render] = maybeRender
    ? [slotsSplitterOrRender as SlotsSplitter<D>, maybeRender as AnyRenderer]
    : [undefined, slotsSplitterOrRender as AnyRenderer]
  let children: Children | undefined
  let setChildren
  let slots = [] as MapSlotDefsToContents<D>
  const block: Block<TNode> = createLazyBlock(() => render(...slots, children))

  if (slotsSplitter) {
    setChildren = (...nextChildren: ChildrenWithSlots<MapSlotDefsToSlot<D>>) => {
      [slots, children] = slotsSplitter(nextChildren)

      return block
    }
  } else {
    setChildren = (...nextChildren: Children) => {
      children = nextChildren

      return block
    }
  }

  return Object.assign(setChildren, block)
}
