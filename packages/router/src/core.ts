import {
  type Accessor,
  DependencyNotFound,
  computed,
  inject,
  provide,
  getContext
} from 'nanoviews/store'
import {
  component$,
  context$,
  effect$,
  swap_
} from 'nanoviews'
import {
  type LayoutMatchRef,
  type PageMatchRef,
  type PageRef,
  type RouteLocationRecord,
  type Routes,
  Page$,
  syncHead,
  router as vanillaRouter
} from '@nano_kit/router'
import type { PageComponent } from './types.js'

function renderPage(Page: PageComponent | null | undefined) {
  return Page?.()
}

function Outlet$(): Accessor<PageComponent | null> {
  throw new DependencyNotFound('Outlet$')
}

/**
 * Renders the page of the layout it is in, at any depth of the layout.
 */
export const Outlet = /* @__PURE__ */ component$(() => swap_(inject(Outlet$), renderPage))

/**
 * Compose a layout with its outlet: the layout is built once, and the page is
 * swapped inside it, at its `Outlet`.
 * @param $outlet - Accessor of the nested page view
 * @param Layout - The layout view
 * @returns Page view of the composed layout
 */
/* @__NO_SIDE_EFFECTS__ */
export function compose(
  $outlet: Accessor<PageComponent | null>,
  Layout: PageComponent
): PageComponent {
  return () => context$(provide(Outlet$, $outlet))(Layout())
}

/**
 * Creates a computed signal that matches the current route against page and layout definitions.
 * Supports nested layouts with the `Outlet` component for the nested content.
 * @param $location - Route match signal containing route and parameters
 * @param pages - Array of page and layout match references
 * @returns Accessor with matched page or null.
 */
/* @__NO_SIDE_EFFECTS__ */
export function router<R extends Routes, K extends keyof R & string>(
  $location: RouteLocationRecord<R>,
  pages: (
    | PageMatchRef<NoInfer<K>, PageComponent>
    | PageMatchRef<null, PageComponent>
    | LayoutMatchRef<NoInfer<K>, PageComponent, PageComponent>
  )[]
): Accessor<PageRef<PageComponent> | null> {
  return vanillaRouter($location, pages, compose)
}

/**
 * Render the view of the matched page.
 * @param $page - Accessor of the matched page reference
 * @returns Block that renders the view and swaps it when another one is matched
 */
/* @__NO_SIDE_EFFECTS__ */
export function pageView($page: Accessor<PageRef<PageComponent> | null>) {
  // Every page of a layout is matched with its own reference, and all of
  // them hold the same composed view: the layout stays, the page swaps inside
  return swap_(computed(() => $page()?.default), renderPage)
}

/**
 * Renders the view of the page matched by `Page$` from the injection context.
 */
export const App = /* @__PURE__ */ component$(() => pageView(inject(Page$)))

/**
 * Sync the document head with the head descriptors of the matched page, while the view is mounted.
 * The head factories are resolved within the current injection context, if there is one.
 * @param $page - Accessor of the matched page reference
 */
export function syncPageHead$($page: Accessor<PageRef<unknown> | null>) {
  const context = getContext()

  effect$(() => syncHead($page, context))
}

/**
 * Sync the document head with the head descriptors of the page matched by
 * `Page$` from the injection context, while the view is mounted.
 * The head factories are resolved within that injection context.
 */
export function syncHead$() {
  syncPageHead$(inject(Page$))
}
