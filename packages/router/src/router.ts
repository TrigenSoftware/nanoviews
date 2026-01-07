import {
  type ReadableSignal,
  type WritableSignal,
  computed,
  signal
} from '@nano_kit/store'
import type { Routes } from './types.js'
import type { RouteLocationRecord } from './navigation.types.js'
import type {
  StoresPreload,
  PageMatchRef,
  LayoutMatchRef,
  MatchRef,
  ViewModuleLoader,
  LoadableRef,
  ViewRef,
  ViewRefGetter,
  UnknownLayoutMatchRef,
  UnknownMatchRef,
  UnknownPageMatchRef,
  UnknownComposer
} from './router.types.js'
import { composeMatchers } from './utils.js'

export * from './router.types.js'

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
    if ('expected' in ref) {
      ref.page(allTasks)
    } else {
      ref.layout(allTasks)
      void loadPages(ref.pages, allTasks)
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
    if ('expected' in ref) {
      if (ref.expected === route) {
        ref.page(allTasks)
        // Page can be not async loadable
        allTasks.add(null)
        break
      }
    } else
      if (allTasks.size < (loadPage(ref.pages, route, allTasks), allTasks.size)) {
        ref.layout(allTasks)
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
export function loadable<const V>(
  load: ViewModuleLoader<V>,
  fallback?: V
): LoadableRef<V> {
  const $viewRef = signal<ViewRef<V>>({
    view: fallback,
    loading: true
  })
  const init = (tasks?: Set<Promise<unknown> | null>) => {
    const promise = load().then(module => $viewRef({
      view: module.default,
      storesToPreload: module.storesToPreload,
      loading: false
    }))

    tasks?.add(promise)
  }
  let initialized = false

  return {
    load(tasks) {
      if (!initialized) {
        initialized = true
        init(tasks)
      }

      return $viewRef()
    }
  }
}

function isLoadable<C = unknown>(ref: unknown): ref is LoadableRef<C> {
  return typeof (ref as LoadableRef<C>)?.load === 'function'
}

function getViewRefGetter<C>(
  page: C | LoadableRef<C>,
  storesToPreload: StoresPreload | undefined
): ViewRefGetter<C> {
  let getter: ViewRefGetter<C>

  if (isLoadable(page)) {
    getter = page.load
  } else {
    const ref = {
      view: page,
      storesToPreload
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
    expected,
    page: getViewRefGetter(page, storesToPreload)
  }
}

/**
 * Define a page match reference for route matching.
 * @param expected - The expected route name to match
 * @param page - The page component or value to return when matched
 * @returns Page view reference object
 */
export function notFound<const P>(
  page: LoadableRef<P>
): PageMatchRef<null, P>

/**
 * Define a page match reference for route matching.
 * @param expected - The expected route name to match
 * @param page - The page component or value to return when matched
 * @param storesToPreload - Optional function to preload stores
 * @returns Page view reference object
 */
export function notFound<const P>(
  page: P,
  storesToPreload?: StoresPreload
): PageMatchRef<null, P>

/* @__NO_SIDE_EFFECTS__ */
export function notFound<const P>(
  page: P | LoadableRef<P>,
  storesToPreload?: StoresPreload
): PageMatchRef<null, P> {
  return {
    expected: null,
    page: getViewRefGetter(page, storesToPreload)
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
    layout: getViewRefGetter(layout, storesToPreload),
    pages
  }
}

function createMatcher(pages: UnknownMatchRef[]): UnknownMatcher {
  return composeMatchers(pages.map(
    ref => ('expected' in ref
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

function createPageMatcher({ expected, page }: UnknownPageMatchRef): UnknownMatcher {
  return (route: string | null) => (route === expected ? page() : null)
}

function createLayoutMatcher({ layout, pages }: UnknownLayoutMatchRef): UnknownMatcher {
  const match = createCachedMatcher(pages)

  return (route: string | null, composed: Composed) => {
    const ref = match(route, composed)

    if (ref) {
      const layoutRef = layout()

      if (layoutRef.loading || !layoutRef.view) {
        return layoutRef
      }

      const storesToPreload = () => [
        ...layoutRef.storesToPreload?.() ?? [],
        ...ref.storesToPreload?.() ?? []
      ]

      return {
        view: composed(layoutRef.view, ref.view),
        storesToPreload
      }
    }

    return null
  }
}

function createComposed(compose: UnknownComposer | undefined): Composed {
  const storage = new Map<unknown, {
    page: WritableSignal<unknown>
    composed: unknown
  }>()

  return (layout: unknown, page: unknown) => {
    let entry = storage.get(layout)

    if (!entry) {
      const $page = signal(page)

      entry = {
        page: $page,
        composed: compose?.($page, layout)
      }
      storage.set(layout, entry)
    } else {
      entry.page(() => page)
    }

    return entry.composed
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
  pages: (
    | PageMatchRef<NoInfer<K>, P>
    | PageMatchRef<null, P>
  )[]
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
    | PageMatchRef<null, P>
    | LayoutMatchRef<NoInfer<K>, N, L>
  )[],
  compose: ($nested: ReadableSignal<N | null>, layout: L) => C
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
  const $page = computed(() => (ref = match($route(), composed))?.view ?? null)
  const storesToPreload = () => {
    $page()
    return ref?.storesToPreload?.() ?? []
  }

  return [$page, storesToPreload]
}
