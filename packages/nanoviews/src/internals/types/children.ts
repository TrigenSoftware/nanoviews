import type { Block } from './block.js'
import type {
  ValueOrStore,
  Primitive
} from './common.js'

export type PrimitiveChild = Block | ValueOrStore<Primitive>

export type Child = PrimitiveChild | Child[]

export type Children = Child[]

export type NoChildren = [] | undefined

export type ChildrenWithSlots<S extends AnySlot, C extends unknown[] = Children> = C extends (infer D)[]
  ? (D | S)[]
  : never

export type SlotId = string | symbol

export type Slot<C, I extends SlotId = SlotId> = {
  [K in I]: C
}

export interface SlotDef<C, I extends SlotId = SlotId> {
  (slotContent: C): Slot<C, I>
  i: I
}

// It's impossible to define a type that extends Slot<unknown>
export type AnySlot = Slot<any>

// It's impossible to define a type that extends SlotDef<unknown>
export type AnySlotDef = SlotDef<any>

export type MapSlotDefsToContents<D extends unknown[]> = D extends [infer F, ...infer R]
  ? [
    F extends SlotDef<infer C>
      ? C | undefined
      : never,
    ...MapSlotDefsToContents<R>
  ]
  : []

export type MapSlotDefsToSlot<D extends AnySlotDef[]> = ReturnType<D[number]>

export type Renderer<
  T extends Node,
  C extends unknown[] = Children
> = (children: C | undefined) => Block<T>

export type ChildrenBlock<
  T extends Node,
  C extends unknown[] = Children
> = (
  (...children: C) => Block<T>
) & Block<T>

export type GetChild = () => PrimitiveChild

export type GetChildHook = (getChild?: GetChild) => void
