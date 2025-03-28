import type {
  AnyFn,
  Children,
  ChildrenWithSlots,
  AnySlotDef,
  MapSlotDefsToContents,
  MapSlotDefsToSlot,
  Renderer,
  RendererWithSlots
} from '../types/index.js'

/**
 * Collect children
 * @param render - Function to render block with given children
 * @returns Function that accepts children
 */
export function collectChildren<
  T extends Node,
  C extends unknown[] = Children
>(render: Renderer<T, C>) {
  return (...children: C) => render(children.length ? children : undefined)
}

export class Slot<
  C,
  F extends (...args: any[]) => Slot<C, F>
> {
  readonly f: F
  readonly c: C

  constructor(
    factory: F,
    content: C
  ) {
    this.f = factory
    this.c = content
  }
}

/**
 * Check if value is a slot
 * @param value
 * @returns Is a slot
 */
export function isSlot(value: unknown): value is Slot<unknown, AnyFn> {
  return value instanceof Slot
}

/**
 * Create slot
 * @param factory - Slot factory identifier
 * @param content - Slot content
 * @returns Slot
 */
export function createSlot<
  C,
  F extends (...args: any[]) => Slot<C, F>
>(factory: F, content: C) {
  return new Slot(factory, content)
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
  const slotDefsLen = slotDefs.length
  const slots = Array(slotDefsLen + 1) as unknown[]
  const restChildren: unknown[] = []
  const len = children?.length

  slots[slotDefsLen] = restChildren

  if (len) {
    for (let i = 0, child: unknown; i < len; i++) {
      child = children[i]

      if (isSlot(child)) {
        let found = false

        for (let j = 0; j < slotDefsLen; j++) {
          if (child.f === slotDefs[j]) {
            slots[j] = child.c
            found = true
            break
          }
        }

        if (!found && import.meta.env.DEV) {
          throw new Error('Unexpected slot')
        }
      } else {
        restChildren.push(child)
      }
    }
  }

  return slots as [...MapSlotDefsToContents<D>, C | undefined]
}

/**
 * Collect defined slots from children
 * @param slotDefs - Slot definitions
 * @param render - Function to render block with given slots and children
 * @returns Function that accepts children
 */
export function collectSlots<
  T extends Node,
  D extends AnySlotDef[]
>(
  slotDefs: [...D],
  render: RendererWithSlots<T, D>
) {
  return (...children: ChildrenWithSlots<MapSlotDefsToSlot<D>>) => render(...getSlots(slotDefs, children))
}
