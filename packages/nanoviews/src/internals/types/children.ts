import type { Signalish } from 'kida'
import type {
  Primitive,
  AnyFn
} from './common.js'

export type LazyChild<T extends AnyFn = () => Child> = T & {
  /** Mark fn as lazy child. */
  c: true
}

export type Child = ChildNode | DocumentFragment | LazyChild<() => Child> | Signalish<Primitive>

export type Children = Child[]

export type ChildrenWithSlots<S, C extends unknown[] = Children> = C extends (infer D)[]
  ? (D | S)[]
  : never

export interface Slot<C, F> {
  f: F
  c: C
}

export interface SlotDef<C> {
  // oxlint-disable-next-line typescript/prefer-function-type
  (slotContent: C): Slot<C, this>
}

export type AnySlot = Slot<any, AnyFn>

export type AnySlotDef = AnyFn

/**
 * Walk a slot definition's return chain down to the slot it eventually creates,
 * stepping through the children receivers a component puts in between.
 */
export type SlotOf<D> = D extends (...args: any[]) => infer R
  ? R extends AnySlot
    ? R
    : SlotOf<R>
  : never

export type MapSlotDefsToContents<D extends unknown[]> = D extends [infer F, ...infer R]
  ? [
    SlotOf<F> extends Slot<infer C, any>
      ? C | undefined
      : never,
    ...MapSlotDefsToContents<R>
  ]
  : []

export type MapSlotDefsToSlot<D extends AnySlotDef[]> = SlotOf<D[number]>

export type Renderer<
  T extends Child | AnySlot,
  C extends unknown[] = Children
> = (children: C) => T

export type RendererWithSlots<
  T extends Child | AnySlot,
  D extends AnySlotDef[]
> = (...children: [...MapSlotDefsToContents<D>, Children]) => T
