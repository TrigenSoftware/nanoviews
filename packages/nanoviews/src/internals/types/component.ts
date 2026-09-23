import type {
  Child,
  Children
} from './children.js'
import type { LazyElement } from './element.js'

export type Render<P extends object, C extends unknown[] = Children> = (props: P, children: C) => Child

/**
 * The children a render takes: none when it has no second parameter to take
 * them with. A render whose type is not known, as with the type arguments
 * written out, keeps the declared ones
 */
export type RenderChildren<R, C extends unknown[] = Children> = R extends (...args: infer A) => unknown
  ? 2 extends A['length']
    ? C
    : []
  : C

/**
 * A component instance: the call with children keeps them, the call with no
 * arguments renders; the parent builds what the render returns on insertion
 */
export type ComponentInstance<C extends unknown[] = Children> = LazyElement<Child, C>

/**
 * A component: props first, children second, both calls optional
 */
export type Component<P extends object, C extends unknown[] = Children> = (
  ...args: {} extends P ? [props?: P] : [props: P]
) => ComponentInstance<C>
