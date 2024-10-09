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
  Renderer
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
 * @param children - Input children with possible slots
 * @returns Slots and rest children
 */
export function getSlots<
  D extends AnySlotDef[],
  C extends unknown[] = Children
>(
  slotDefs: [...D],
  children: ChildrenWithSlots<MapSlotDefsToSlot<D>, C> | undefined
): [...MapSlotDefsToContents<D>, C | undefined] {
  const slots = Array(slotDefs.length) as unknown[]
  const restChildren: unknown[] = []

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

  return [...(slots as MapSlotDefsToContents<D>), restChildren as C]
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
