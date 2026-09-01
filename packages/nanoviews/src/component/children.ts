import type {
  Child,
  Children,
  AnySlot,
  ChildrenWithSlots,
  AnySlotDef,
  MapSlotDefsToContents,
  MapSlotDefsToSlot,
  Renderer,
  RendererWithSlots
} from '../internals/types/index.js'
import { lazyChild } from '../internals/index.js'

/**
 * Collect children
 * @param render - Function to render block with given children
 * @returns Function that accepts children
 */
export function children$<
  T extends Child | AnySlot,
  C extends unknown[] = Children
>(render: Renderer<T, C>) {
  return lazyChild(
    (...children: C) => render(children)
  )
}

/**
 * Check if value is a slot
 * @param value
 * @returns Is a slot
 */
export function isSlot(value: unknown): value is AnySlot {
  return typeof value === 'object' && value !== null && 'c' in (value as AnySlot)
}

/**
 * Create slot
 * @param factory - Slot factory identifier
 * @param content - Slot content
 * @returns Slot
 */
export function slot$<
  C,
  F extends AnySlotDef
>(factory: F, content: C) {
  return {
    f: factory,
    c: content
  }
}

/**
 * Get defined slots from children
 * @param slotDefs - Slot definitions
 * @param children - Input children with possible slots
 * @throws {Error} If a child is a slot that none of `slotDefs` declares
 * @returns Slots and rest children
 */
export function getSlots<
  D extends AnySlotDef[],
  C extends unknown[] = Children
>(
  slotDefs: [...D],
  children: ChildrenWithSlots<MapSlotDefsToSlot<D>, C>
): [...MapSlotDefsToContents<D>, C] {
  const slotDefsLen = slotDefs.length
  const slots = Array(slotDefsLen + 1) as unknown[]
  const restChildren: unknown[] = []
  const len = children?.length

  slots[slotDefsLen] = restChildren

  if (len) {
    for (let i = 0, child: unknown; i < len; i++) {
      child = children[i]

      if (isSlot(child)) {
        const j = slotDefs.indexOf(child.f)

        // A slot nobody declared here has no place to go: it would vanish
        // without a sound, so it stops one call away from the mistake
        if (j < 0) {
          throw new Error('Slot is not declared in slots$')
        }

        slots[j] = child.c
      } else {
        restChildren.push(child)
      }
    }
  }

  return slots as [...MapSlotDefsToContents<D>, C]
}

/**
 * Collect defined slots from children
 * @param slotDefs - Slot definitions
 * @param render - Function to render block with given slots and children
 * @returns Function that accepts children
 */
export function slots$<
  T extends Child | AnySlot,
  D extends AnySlotDef[]
>(
  slotDefs: [...D],
  render: RendererWithSlots<T, D>
) {
  return lazyChild(
    (...children: ChildrenWithSlots<MapSlotDefsToSlot<D>>) => render(
      ...getSlots(slotDefs, children)
    )
  )
}
