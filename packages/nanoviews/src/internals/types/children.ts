import type { Block } from './block.js'
import type {
  ValueOrStore,
  Primitive
} from './common.js'

export type PrimitiveChild = Block | ValueOrStore<Primitive>

export type Child = PrimitiveChild | Child[]

export type Children = Child[]

export type ChildrenWithSlots<S extends AnySlot> = (Child | S)[]

export type SlotId = string | symbol

export type Slot<C, I extends SlotId = SlotId> = {
  [K in I]: C
}

export interface SlotDef<C, I extends SlotId = SlotId> {
  (slotContent: C): Slot<C, I>
  i: I
}

// It's impossible to define a type that extends Slot<unknown>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySlot = Slot<any>

// It's impossible to define a type that extends SlotDef<unknown>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export type SlotsSplitter<D extends AnySlotDef[]> = (
  children: ChildrenWithSlots<MapSlotDefsToSlot<D>>
) => readonly [MapSlotDefsToContents<D>, Children]

export type Renderer<TNode extends Node> = (children: Children | undefined) => Block<TNode>

export type RendererWithSlots<
  D extends AnySlotDef[],
  TNode extends Node
> = (...children: [...MapSlotDefsToContents<D>, Children | undefined]) => Block<TNode>

export type ChildrenBlock<TNode extends Node = Node> = (
  (...children: Children) => Block<TNode>
) & Block<TNode>

export type ChildrenBlockWithOnlySlots<
  D extends AnySlotDef[],
  TNode extends Node
> = (
  (...children: MapSlotDefsToSlot<D>[]) => Block<TNode>
) & Block<TNode>

export type ChildrenBlockWithSlots<
  D extends AnySlotDef[],
  TNode extends Node
> = (
  (...children: ChildrenWithSlots<MapSlotDefsToSlot<D>>) => Block<TNode>
) & Block<TNode>

export type GetChild = () => PrimitiveChild

export type GetChildHook = (getChild?: GetChild) => void
