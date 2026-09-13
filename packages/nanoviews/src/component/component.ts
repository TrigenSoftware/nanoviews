import {
  type Children,
  type Render,
  type Component,
  type ComponentInstance,
  lazyChild
} from '../internals/index.js'

/**
 * Create a component. An instance takes its children in one call and renders
 * in the call with no arguments, the one the parent makes on build, so the
 * parent's injection context and scope are in place when the render runs
 * @param render - Function to render the component with props and children
 * @returns The component
 */
/* @__NO_SIDE_EFFECTS__ */
export function component$<
  P extends object = object,
  C extends unknown[] = Children
>(render: Render<P, C>) {
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
  }) as Component<P, C>
}
