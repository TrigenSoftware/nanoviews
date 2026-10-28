import type {
  Child,
  LazyChild
} from 'nanoviews'
import {
  type EffectCallback,
  type InjectionProvider,
  InjectionContext,
  getContext,
  unsafeRun,
  noop
} from 'kida'
import { renderChild } from './internals/render.js'

export {
  component$,
  polymorphic$,
  slot$,
  slots$,
  getSlots,
  isSlot
} from 'nanoviews'

function renderContext(this: InjectionProvider[] | [InjectionContext], child: Child) {
  const currentContext = getContext()

  // With nothing to provide and a context to inherit there is nothing to
  // enter: the child is handed back, and written under the caller's context
  if (!this.length && currentContext !== undefined) {
    return child
  }

  unsafeRun(
    this[0] instanceof InjectionContext
      ? this[0]
      : new InjectionContext(this as InjectionProvider[], currentContext),
    renderChild,
    child
  )
}

/**
 * Provide dependencies to a child: it is built within a child injection
 * context with the given values, or within the current one when there are
 * none to give and there is a context to inherit.
 * @param providers - The values to provide.
 * @returns Function that accepts the child.
 */
export function context$(...providers: InjectionProvider[]): (child: Child) => LazyChild

/**
 * Build a child within the given injection context.
 * @param context - The injection context to build the child within.
 * @returns Function that accepts the child.
 */
export function context$(context: InjectionContext): (child: Child) => LazyChild

/* @__NO_SIDE_EFFECTS__ */
export function context$(...providers: InjectionProvider[] | [InjectionContext]) {
  return (child: Child) => renderContext.bind(providers, child) as unknown as LazyChild
}

/**
 * Isolate a child: it is built without an injection context.
 * @param child - The child to isolate.
 * @returns The isolated child.
 */
/* @__NO_SIDE_EFFECTS__ */
export function isolate$(child: Child) {
  return unsafeRun.bind(null, undefined, renderChild, child) as unknown as LazyChild
}

/**
 * Create an effect of a view. It first runs once the tree is in the
 * document, and on the server it never is: nothing runs
 * @param fn - The effect function
 */
export const effect$: (fn: EffectCallback) => void = noop
