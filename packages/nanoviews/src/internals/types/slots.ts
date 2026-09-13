import type {
  Child,
  Children
} from './children.js'

/**
 * An instance of a slot component: it names the component it is an instance
 * of, so a layout can pick it out of its children
 */
export interface SlotInstance<P extends object = object, C extends unknown[] = Children> {
  /** Mark fn as lazy child. */
  c: true
  /** The slot component */
  f: SlotComponent<P, C>
  (): Child
  (...children: C): SlotInstance<P, C>
}

/**
 * A slot component: a component whose instances are slots
 */
export type SlotComponent<P extends object = object, C extends unknown[] = Children> = (
  ...args: {} extends P ? [props?: P] : [props: P]
) => SlotInstance<P, C>

// oxlint-disable-next-line typescript/no-explicit-any
export type AnySlotInstance = SlotInstance<any, any>

// oxlint-disable-next-line typescript/no-explicit-any
export type AnySlotComponent = SlotComponent<any, any>

export type SlotOf<D> = D extends SlotComponent<infer P, infer C>
  ? SlotInstance<P, C> | undefined
  : never

export type SlotsOf<D extends AnySlotComponent[]> = {
  [K in keyof D]: SlotOf<D[K]>
}

export type SlotsRender<P extends object, D extends AnySlotComponent[]> = (
  props: P,
  ...args: [...SlotsOf<D>, Children]
) => Child
