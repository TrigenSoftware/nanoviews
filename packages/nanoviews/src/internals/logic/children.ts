import {
  createLazyBlock,
  isBlockSymbol
} from '../block.js'
import type {
  Block,
  Children,
  ChildrenWithSlots,
  ChildrenBlock,
  SlotId,
  Slot,
  SlotDef,
  AnySlotDef,
  MapSlotDefsToContents,
  MapSlotDefsToSlot,
  Renderer,
  RendererWithSlots
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
 * Get defined slots from children
 * @param slotDefs - Slot definitions
 * @param render - Function to render block with given slots and children
 * @returns Function that accepts children
 */
export function getSlots<
  D extends AnySlotDef[],
  TNode extends Node
>(
  slotDefs: [...D],
  render: RendererWithSlots<D, TNode>
): Renderer<TNode, ChildrenWithSlots<MapSlotDefsToSlot<D>>> {
  return (children) => {
    const slots = Array(slotDefs.length) as unknown[]
    const restChildren: Children = []

    children?.forEach((child) => {
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

    return render(...(slots as MapSlotDefsToContents<D>), restChildren)
  }
}

/**
 * Create children setter for a component
 * @param render - Component blocks renderer
 * @returns Component block with children setter
 */
export function getChildren<
  T extends Node,
  C extends unknown[] = Children
>(render: Renderer<T, C>): ChildrenBlock<T, C> {
  let children: C
  const block: Block<T> = createLazyBlock(() => render(children))

  return Object.assign((...nextChildren: C) => {
    children = nextChildren

    return block
  }, block)
}
