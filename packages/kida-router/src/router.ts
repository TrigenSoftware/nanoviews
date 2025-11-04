import {
  type ReadableSignal,
  type WritableSignal,
  computed,
  signal
} from 'kida'
import type {
  StoresPreload,
  PageMatchRef,
  LayoutMatchRef,
  MatchRef,
  RouteLocationRecord,
  Routes,
  ViewModuleLoader,
  LoadableRef,
  ViewRef,
  ViewRefGetter,
  UnknownLayoutMatchRef,
  UnknownMatchRef,
  UnknownPageMatchRef,
  UnknownComposer
} from './types/index.js'
import { composeMatchers } from './utils.js'

type Composed = (layout: unknown, page: unknown) => unknown

type UnknownMatcher = (route: string | null, composed: Composed) => ViewRef<unknown> | null

/**
 * Load all lazy pages in the pages reference tree.
 * @param pages - Pages reference tree
 * @returns Promise that resolves when all pages are loaded
 */
export async function loadPages(
  pages: UnknownMatchRef[],
  tasks?: Set<Promise<unknown>>
): Promise<void> {
  const allTasks = tasks ?? new Set()

  for (const ref of pages) {
    if ('e' in ref) {
      ref.p(allTasks)
    } else {
      ref.l(allTasks)
      void loadPages(ref.p, allTasks)
    }
  }

  if (!tasks) {
    await Promise.all(allTasks)
  }
}

/**
 * Load a specific lazy page by route in the pages reference tree.
 * @param pages - Pages reference tree
 * @param route - Route name to load
 * @returns Promise that resolves when the page is loaded
 */
export async function loadPage<R extends Routes, K extends keyof R & string, P, L>(
  pages: MatchRef<K, P, L>[],
  route: K,
  tasks?: Set<Promise<unknown> | null>
): Promise<void> {
  const allTasks = tasks ?? new Set()

  for (const ref of pages) {
    if ('e' in ref) {
      if (ref.e === route) {
        ref.p(allTasks)
        // Page can be not async loadable
        allTasks.add(null)
        break
      }
    } else
      if (allTasks.size < (loadPage(ref.p, route, allTasks), allTasks.size)) {
        ref.l(allTasks)
        break
      }
  }

  if (!tasks) {
    await Promise.all(allTasks)
  }
}

/**
 * Define a loadable view.
 * @param load - Function that loads the view module
 * @param fallback - Optional fallback view while loading
 * @returns Loadable view reference object
 */
/* @__NO_SIDE_EFFECTS__ */
export function loadable<const C>(
  load: ViewModuleLoader<C>,
  fallback?: C
): LoadableRef<C> {
  const $viewRef = signal<ViewRef<C>>({
    c: fallback,
    l: true
  })
  const init = (tasks?: Set<Promise<unknown> | null>) => {
    const promise = load().then(module => $viewRef({
      c: module.default,
      s: module.storesToPreload,
      l: false
    }))

    tasks?.add(promise)
  }
  let initialized = false

  return {
    g(tasks) {
      if (!initialized) {
        initialized = true
        init(tasks)
      }

      return $viewRef()
    }
  }
}

function isLoadable<C = unknown>(ref: unknown): ref is LoadableRef<C> {
  return typeof (ref as LoadableRef<C>)?.g === 'function'
}

function getViewRefGetter<C>(
  page: C | LoadableRef<C>,
  storesToPreload: StoresPreload | undefined
): ViewRefGetter<C> {
  let getter: ViewRefGetter<C>

  if (isLoadable(page)) {
    getter = page.g
  } else {
    const ref = {
      c: page,
      s: storesToPreload
    }

    getter = () => ref
  }

  return getter
}

/**
 * Define a page match reference for route matching.
 * @param expected - The expected route name to match
 * @param page - The page component or value to return when matched
 * @returns Page view reference object
 */
export function page<R extends string, const P>(
  expected: R,
  page: LoadableRef<P>
): PageMatchRef<R, P>

/**
 * Define a page match reference for route matching.
 * @param expected - The expected route name to match
 * @param page - The page component or value to return when matched
 * @param storesToPreload - Optional function to preload stores
 * @returns Page view reference object
 */
export function page<R extends string, const P>(
  expected: R,
  page: P,
  storesToPreload?: StoresPreload
): PageMatchRef<R, P>

/* @__NO_SIDE_EFFECTS__ */
export function page<R extends string, const P>(
  expected: R,
  page: P | LoadableRef<P>,
  storesToPreload?: StoresPreload
): PageMatchRef<R, P> {
  return {
    e: expected,
    p: getViewRefGetter(page, storesToPreload)
  }
}

/**
 * Define a layout match reference for nested route matching.
 * @param layout - The layout component or value
 * @param pages - Array of page or nested layout match references
 * @returns Layout match reference object
 */
export function layout<R extends string, P, const L>(
  layout: L | LoadableRef<L>,
  pages: MatchRef<R, P, L>[]
): LayoutMatchRef<R, P, L>

/**
 * Define a layout match reference for nested route matching.
 * @param layout - The layout component or value
 * @param pages - Array of page or nested layout match references
 * @param storesToPreload - Optional function to preload stores
 * @returns Layout match reference object
 */
export function layout<R extends string, P, const L>(
  layout: L,
  storesToPreload: StoresPreload,
  pages: MatchRef<R, P, L>[]
): LayoutMatchRef<R, P, L>

/* @__NO_SIDE_EFFECTS__ */
export function layout(
  layout: unknown,
  stroesToPreloadOrPages: StoresPreload | UnknownMatchRef[],
  maybePages?: UnknownMatchRef[]
) {
  let pages: UnknownMatchRef[]
  let storesToPreload: StoresPreload | undefined

  if (maybePages === undefined) {
    pages = stroesToPreloadOrPages as UnknownMatchRef[]
  } else {
    pages = maybePages
    storesToPreload = stroesToPreloadOrPages as StoresPreload
  }

  return {
    l: getViewRefGetter(layout, storesToPreload),
    p: pages
  }
}

function createMatcher(pages: UnknownMatchRef[]): UnknownMatcher {
  return composeMatchers(pages.map(
    ref => ('e' in ref
      ? createPageMatcher(ref)
      : createLayoutMatcher(ref))
  ))
}

// For SSR purposes, create matcher once
const matcherCache = new WeakMap<UnknownMatchRef[], ReturnType<typeof createMatcher>>()

function createCachedMatcher(pages: UnknownMatchRef[]) {
  let matcher = matcherCache.get(pages)

  if (!matcher) {
    matcher = createMatcher(pages)
    matcherCache.set(pages, matcher)
  }

  return matcher
}

function createPageMatcher({ e, p }: UnknownPageMatchRef): UnknownMatcher {
  return (route: string | null) => (route === e ? p() : null)
}

function createLayoutMatcher({ l, p }: UnknownLayoutMatchRef): UnknownMatcher {
  const match = createCachedMatcher(p)

  return (route: string | null, composed: Composed) => {
    const ref = match(route, composed)

    if (ref) {
      const layoutRef = l()

      if (layoutRef.l || !layoutRef.c) {
        return layoutRef
      }

      const storesToPreload = () => [
        ...layoutRef.s?.() ?? [],
        ...ref.s?.() ?? []
      ]

      return {
        c: composed(layoutRef.c, ref.c),
        s: storesToPreload
      }
    }

    return null
  }
}

function createComposed(compose: UnknownComposer | undefined): Composed {
  const storage = new Map<unknown, {
    p: WritableSignal<{ v: unknown }>
    c: unknown
  }>()

  return (layout: unknown, page: unknown) => {
    let entry = storage.get(layout)

    if (!entry) {
      const $page = signal({
        v: page
      })

      entry = {
        p: $page,
        c: compose?.($page, layout)
      }
      storage.set(layout, entry)
    } else {
      entry.p({
        v: page
      })
    }

    return entry.c
  }
}

/**
 * Creates a computed signal that matches the current route against page definitions.
 * @param $location - Route match signal containing route and parameters
 * @param pages - Array of page match references
 * @returns Tuple of computed signal containing the matched page or null and function to preload stores
 */
export function router<R extends Routes, K extends keyof R & string, P>(
  $location: RouteLocationRecord<R>,
  pages: PageMatchRef<NoInfer<K>, P>[]
): [ReadableSignal<P | null>, StoresPreload]

/**
 * Creates a computed signal that matches the current route against page and layout definitions.
 * Supports nested layouts with composition function for combining layouts with nested content.
 * @param $location - Route match signal containing route and parameters
 * @param pages - Array of page and layout match references
 * @param compose - Function to compose layouts with nested content
 * @returns Tuple of computed signal containing the matched page or composed layout and function to preload stores
 */
export function router<R extends Routes, K extends keyof R & string, P, N, L, C>(
  $location: RouteLocationRecord<R>,
  pages: (
    | PageMatchRef<NoInfer<K>, P>
    | LayoutMatchRef<NoInfer<K>, N, L>
  )[],
  compose: ($nested: ReadableSignal<{ v: N | null }>, layout: L) => C
): [ReadableSignal<P | C | null>, StoresPreload]

/* @__NO_SIDE_EFFECTS__ */
export function router(
  $location: RouteLocationRecord<Routes>,
  pages: UnknownMatchRef[],
  compose?: UnknownComposer
): [ReadableSignal<unknown>, StoresPreload] {
  const { $route } = $location
  const match = createCachedMatcher(pages)
  const composed = createComposed(compose)
  let ref: ViewRef<unknown> | null = null
  const $page = computed(() => (ref = match($route(), composed))?.c ?? null)
  const storesToPreload = () => {
    $page()
    return ref?.s?.() ?? []
  }

  return [$page, storesToPreload]
}
