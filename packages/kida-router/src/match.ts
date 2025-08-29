import {
  type ReadableSignal,
  computed,
  signal
} from 'kida'
import type {
  PageMatchRef,
  LayoutMatchRef,
  RouteMatchSignal,
  Routes
} from './types/index.js'
import { composeMatchers } from './utils.js'

type UnknownComposer = ($nested: ReadableSignal<unknown>, layout: unknown) => unknown

type UnknownPageMatchRef = PageMatchRef<string, unknown>

type UnknownLayoutMatchRef = LayoutMatchRef<string, unknown, unknown>

/**
 * Creates a page match reference for route matching.
 * @param expected - The expected route name to match
 * @param page - The page component or value to return when matched
 * @returns Page match reference object
 */
/* @__NO_SIDE_EFFECTS__ */
export function page<E extends string, const P>(
  expected: E,
  page: P
) {
  return {
    e: expected,
    p: page
  }
}

/**
 * Creates a layout match reference for nested route matching.
 * @param layout - The layout component or value
 * @param pages - Array of page or nested layout match references
 * @returns Layout match reference object
 */
/* @__NO_SIDE_EFFECTS__ */
export function layout<R extends string, P, const L>(
  layout: L,
  pages: (
    | PageMatchRef<R, P>
    | LayoutMatchRef<R, P, L>
  )[]
) {
  return {
    l: layout,
    p: pages
  }
}

function createMatcher(
  pages: (UnknownPageMatchRef | UnknownLayoutMatchRef)[],
  compose?: UnknownComposer
) {
  return composeMatchers(pages.map(
    ref => ('e' in ref
      ? createPageMatcher(ref)
      : createLayoutMatcher(ref, compose))
  ))
}

function createPageMatcher({ e, p }: UnknownPageMatchRef) {
  return (route: string | null) => (route === e ? p : null)
}

function createLayoutMatcher(
  { l, p }: UnknownLayoutMatchRef,
  compose?: UnknownComposer
) {
  const match = createMatcher(p, compose)
  const $nested = signal<unknown>(null)
  const composed = compose?.($nested, l)

  return (route: string | null) => {
    const value = match(route)

    if (value) {
      $nested(value)
      return composed
    }

    $nested(null)

    return null
  }
}

/**
 * Creates a computed signal that matches the current route against page definitions.
 * @param $route - Route match signal containing route and parameters
 * @param pages - Array of page match references
 * @returns Computed signal containing the matched page or null
 */
export function match<R extends Routes, K extends keyof R & string, P>(
  $route: RouteMatchSignal<R>,
  pages: PageMatchRef<NoInfer<K>, P>[]
): ReadableSignal<P | null>

/**
 * Creates a computed signal that matches the current route against page and layout definitions.
 * Supports nested layouts with composition function for combining layouts with nested content.
 * @param $route - Route match signal containing route and parameters
 * @param pages - Array of page and layout match references
 * @param compose - Function to compose layouts with nested content
 * @returns Computed signal containing the matched page, composed layout, or null
 */
export function match<R extends Routes, K extends keyof R & string, P, N, L, C>(
  $route: RouteMatchSignal<R>,
  pages: (
    | PageMatchRef<NoInfer<K>, P>
    | LayoutMatchRef<NoInfer<K>, N, L>
  )[],
  compose: ($nested: ReadableSignal<N | null>, layout: L) => C
): ReadableSignal<P | C | null>

/* @__NO_SIDE_EFFECTS__ */
export function match(
  $route: RouteMatchSignal<Routes>,
  pages: (
    | UnknownPageMatchRef
    | UnknownLayoutMatchRef
  )[],
  compose?: UnknownComposer
): ReadableSignal<unknown> {
  const match = createMatcher(pages, compose)

  return computed(() => match($route().route))
}
