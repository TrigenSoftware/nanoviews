import {
  type Children,
  type Render,
  type RenderChildren,
  type Component,
  type ComponentInstance,
  type PolymorphicTarget,
  type PolymorphicComponent,
  type PolymorphicOwnProps,
  type PolymorphicTargets,
  lazyChild
} from '../internals/index.js'

/**
 * Create a component. An instance takes its children in one call and renders
 * in the call with no arguments, the one the parent makes on build, so the
 * parent's injection context and scope are in place when the render runs.
 * A render with no `children` parameter makes a component that takes none
 * @param render - Function to render the component with props and children
 * @returns The component
 */
/* @__NO_SIDE_EFFECTS__ */
export function component$<
  P extends object = object,
  C extends unknown[] = Children,
  // The render as it is written: `P` and `C` say what it is given, and only
  // the function itself says whether it has the parameter for the children
  R = unknown
>(render: R & Render<P, C>) {
  return ((props: P = {} as P) => {
    let children: C | undefined
    const instance: ComponentInstance<C> = lazyChild((...args: C) => {
      if (args.length) {
        children = args

        return instance
      }

      return render(props, (children ?? []) as C)
    }) as ComponentInstance<C>

    return instance
  }) as Component<P, RenderChildren<R, C>>
}

/**
 * Create a polymorphic component, one that renders the element or the
 * component its caller gives in `as`. The render is that of `component$`,
 * written for the default target: its props extend `PolymorphicProps` of
 * that target, and it sets the default of `as`. The component takes its own
 * props and those of the target in `as`, the default one without it, and
 * only the targets that `PolymorphicProps` allows
 * @param render - Function to render the component with props and children
 * @returns The polymorphic component
 */
export const polymorphic$ = component$ as <
  P extends { as?: PolymorphicTarget },
  C extends unknown[] = Children,
  R = unknown
>(render: R & Render<P, C>) => PolymorphicComponent<
  NonNullable<P['as']>,
  PolymorphicOwnProps<P>,
  RenderChildren<R, C>,
  PolymorphicTargets<P>
>
