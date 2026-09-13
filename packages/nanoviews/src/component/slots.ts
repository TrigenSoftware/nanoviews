import {
  type Child,
  type Children,
  type Render,
  type SlotInstance,
  type SlotComponent,
  type AnySlotInstance,
  type AnySlotComponent,
  type SlotsOf,
  type SlotsRender,
  isLazyChild,
  lazyChild
} from '../internals/index.js'

/**
 * Create a slot component: a component whose instances name it, so a `slots$`
 * layout can pick them out of its children
 * @param render - Function to render the slot with props and children
 * @returns The slot component
 */
/* @__NO_SIDE_EFFECTS__ */
export function slot$<
  P extends object = object,
  C extends unknown[] = Children
>(render: Render<P, C>) {
  const slot = ((props: P = {} as P) => {
    let children: C | undefined
    const instance: SlotInstance<P, C> = lazyChild((...args: C) => {
      if (args.length) {
        children = args

        return instance
      }

      return render(props, (children ?? []) as C)
    }) as SlotInstance<P, C>

    instance.f = slot

    return instance
  }) as SlotComponent<P, C>

  return slot
}

/**
 * Check if value is a slot instance
 * @param value
 * @returns Is a slot instance
 */
export function isSlot(value: unknown): value is AnySlotInstance {
  return isLazyChild(value) && 'f' in value
}

/**
 * Get declared slots from children
 * @param defs - Slot components
 * @param children - Children with possible slot instances
 * @throws {Error} If a child is a slot that none of `defs` declares
 * @returns Slots in declaration order and the rest children
 */
export function getSlots<D extends AnySlotComponent[]>(
  defs: [...D],
  children: Children
) {
  const defsLen = defs.length
  const slots = Array(defsLen + 1) as unknown[]
  const rest: Children = []

  slots[defsLen] = rest

  for (let i = 0, len = children.length, child: Child; i < len; i++) {
    child = children[i]

    if (isSlot(child)) {
      const j = defs.indexOf(child.f)

      // A slot nobody declared here has no place to go: it would vanish
      // without a sound, so it stops one call away from the mistake
      if (j < 0) {
        throw new Error('Slot is not declared in slots$')
      }

      slots[j] = child
    } else {
      rest.push(child)
    }
  }

  return slots as [...SlotsOf<D>, Children]
}

/**
 * Take the slots out of the children of a component: the render gets the
 * declared slots in order, an instance or `undefined` each, and the rest of
 * the children last
 * @param defs - Slot components
 * @param render - Function to render with props, slots and children
 * @returns Function to render with props and children
 */
/* @__NO_SIDE_EFFECTS__ */
export function slots$<
  P extends object,
  D extends AnySlotComponent[]
>(
  defs: [...D],
  render: SlotsRender<P, D>
): Render<P> {
  return (props, children) => render(props, ...getSlots(defs, children))
}
