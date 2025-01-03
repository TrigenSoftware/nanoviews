import type { Slot } from '../logic/children.js'
import type { Block } from '../block.js'
import type {
  ValueOrSignal,
  Primitive,
  AnyFn
} from './common.js'

export type LazyBlock = () => Block

export type PrimitiveChild = Block | LazyBlock | ValueOrSignal<Primitive>

export type Child = PrimitiveChild | Child[]

export type Children = Child[]

export type ChildrenWithSlots<S extends AnySlot, C extends unknown[] = Children> = C extends (infer D)[]
  ? (D | S)[]
  : never

export interface SlotDef<C> {
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  (slotContent: C): Slot<C, this>
}

// It's impossible to define a type that extends Slot<unknown>
export type AnySlot = Slot<any, AnyFn>

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

export type RendererWithSlots<
  T extends Node,
  D extends AnySlotDef[]
> = (...children: [...MapSlotDefsToContents<D>, Children | undefined]) => Block<T>
