import type {
  ElementName,
  PickElementType
} from './dom/elements.js'
import type { Attributes } from './attributes.js'
import type {
  LazyChild,
  Child,
  Children
} from './children.js'

/**
 * A description of a node without children: the call builds it
 */
export type LazyVoidElement<T extends Child> = LazyChild<() => T>

/**
 * A description of an element: the call with children keeps them for the
 * build, the call with no arguments builds the element
 */
export interface LazyElement<T extends Child, C extends unknown[] = Children> {
  /** Mark fn as lazy child. */
  c: true
  (): T
  (...children: C): LazyElement<T, C>
}

export type VoidElementFactory<Tag extends ElementName> = (attributes?: Attributes<Tag>) => LazyVoidElement<PickElementType<Tag>>

export type ElementFactory<Tag extends ElementName> = (attributes?: Attributes<Tag>) => LazyElement<PickElementType<Tag>>
