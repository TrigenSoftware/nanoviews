import type {
  Child,
  Children
} from './children.js'
import type {
  LazyElement,
  ElementFactory
} from './element.js'
import type { ElementName } from './dom/elements.js'

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

/**
 * What the `as` prop of a polymorphic component takes: the factory of an
 * element that takes children, or a component
 */
export type PolymorphicTarget = (props?: any) => LazyElement<any, any>

/**
 * The props of a polymorphic target: the attributes of an element, the props
 * of a component
 */
export type PropsOf<T extends PolymorphicTarget> = NonNullable<Parameters<T>[0]>

type TargetOf<T extends ElementName | PolymorphicTarget> = T extends ElementName ? ElementFactory<T> : T

// The key of the targets `as` may take: the props carry them for the types only
declare const targets: unique symbol

/**
 * The props of a polymorphic render: `as` of the default target, given by its
 * tag name or as it is, and the props of that target. The targets that `as`
 * may take besides the default one are all of them, or those given second
 */
export type PolymorphicProps<
  T extends ElementName | PolymorphicTarget,
  A extends ElementName | PolymorphicTarget = PolymorphicTarget
> = {
  as?: TargetOf<T>
  [targets]?: TargetOf<T | A>
} & (TargetOf<T> extends PolymorphicTarget ? PropsOf<TargetOf<T>> : never)

/**
 * The targets the `as` of a polymorphic render may take
 */
export type PolymorphicTargets<P extends { as?: PolymorphicTarget }> = P extends { [targets]?: infer A extends PolymorphicTarget }
  ? A
  : PolymorphicTarget

type IsSame<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false

/**
 * The own props of a polymorphic render: its props but `as` and those it
 * takes from the default target as they are. A prop declared again with a
 * type of its own, such as the `color` of a kit, is an own one
 */
export type PolymorphicOwnProps<P extends { as?: PolymorphicTarget }> = {
  [K in keyof P as K extends 'as' | typeof targets
    ? never
    : K extends keyof PropsOf<NonNullable<P['as']>>
      ? IsSame<P[K], PropsOf<NonNullable<P['as']>>[K]> extends true ? never : K
      : K]: P[K]
}

/**
 * The props of a polymorphic component called with a target: its own props,
 * `as` and the props of the target
 */
export type PolymorphicComponentProps<T extends PolymorphicTarget, P extends object> = P & {
  as?: T
} & Omit<PropsOf<T>, keyof P | 'as'>

/**
 * A polymorphic component: the props follow the target in `as`, one of the
 * targets it takes, the default one without it, and are optional when none of
 * them is required
 */
export type PolymorphicComponent<
  D extends PolymorphicTarget,
  P extends object,
  C extends unknown[] = Children,
  A extends PolymorphicTarget = PolymorphicTarget
> = <T extends A = Extract<D, A>>(
  ...args: {} extends PolymorphicComponentProps<T, P>
    ? [props?: PolymorphicComponentProps<T, P>]
    : [props: PolymorphicComponentProps<T, P>]
) => ComponentInstance<C>
