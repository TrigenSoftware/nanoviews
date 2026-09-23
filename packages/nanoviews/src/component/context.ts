import {
  type InjectionProvider,
  InjectionContext,
  getContext,
  unsafeRun
} from 'kida'
import {
  type Child,
  type LazyChild,
  childToNode,
  lazyChild
} from '../internals/index.js'

/**
 * Provide dependencies to a child: it is built within a child injection
 * context with the given values, or within the current one when there are
 * none to give and there is a context to inherit.
 * @param providers - The values to provide.
 * @returns Function that accepts the child.
 */
export function context$(...providers: InjectionProvider[]): (child: Child) => LazyChild

/**
 * Build a child within the given injection context. The context is used as
 * it is: the child sees its values and those of the parent it was created
 * with, not the current context, and what the child resolves is kept in it,
 * so code that holds the instance shares the same dependencies.
 * @param context - The injection context to build the child within.
 * @returns Function that accepts the child.
 */
export function context$(context: InjectionContext): (child: Child) => LazyChild

/* @__NO_SIDE_EFFECTS__ */
export function context$(...providers: InjectionProvider[] | [InjectionContext]) {
  return (child: Child) => lazyChild(() => {
    const currentContext = getContext()

    // With nothing to provide and a context to inherit there is nothing to
    // enter: the child is handed back as it is, and the parent builds it
    // under the caller's context on its way through `childToNode`
    return !providers.length && currentContext !== undefined
      ? child
      : unsafeRun(
        providers[0] instanceof InjectionContext
          ? providers[0]
          : new InjectionContext(providers as InjectionProvider[], currentContext),
        childToNode,
        child
      )
  })
}

/**
 * Isolate a child: it is built without an injection context, so nothing
 * above it is reachable.
 * @param child - The child to isolate.
 * @returns The isolated child.
 */
/* @__NO_SIDE_EFFECTS__ */
export function isolate$(child: Child) {
  return lazyChild(() => unsafeRun(undefined, childToNode, child))
}
