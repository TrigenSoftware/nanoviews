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

