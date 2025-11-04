import {
  type InjectionFactory,
  type ReadableSignal,
  inject
} from 'kida'
import type {
  LayoutMatchRef,
  Navigation,
  PageMatchRef,
  RouteLocationRecord,
  Routes,
  StoresPreload,
  UnknownComposer,
  UnknownMatchRef
} from './types/index.js'
import {
  browserNavigation,
  virtualNavigation
} from './navigation.js'
import { router } from './router.js'

/**
 * Create browser navigation and location injection factories.
 * @param routes - Routes object defining path patterns.
 * @returns Tuple of location and navigation injection factories.
 */
/* @__NO_SIDE_EFFECTS__ */
export function browserNavigation$$<const R extends Routes = {}>(
  routes: R = {} as R
): [
  InjectionFactory<RouteLocationRecord<R>>,
  InjectionFactory<Navigation>
] {
  const $BrowserNavigation = () => browserNavigation(routes)
  const $Location = () => inject($BrowserNavigation)[0]
  const $Navigation = () => inject($BrowserNavigation)[1]

  return [
    $Location,
    $Navigation
  ]
}

/**
 * Create virtual navigation and location injection factories.
 * @param initialPath - Initial path for the virtual navigation (default: '/').
 * @param routes - Routes object defining path patterns.
 * @returns Tuple of location and navigation injection factories.
 */
/* @__NO_SIDE_EFFECTS__ */
export function virtualNavigation$$<const R extends Routes = {}>(
  initialPath?: string,
  routes?: R
): [
  InjectionFactory<RouteLocationRecord<R>>,
  InjectionFactory<Navigation>
] {
  const $VirtualNavigation = () => virtualNavigation(initialPath, routes)
  const $Location = () => inject($VirtualNavigation)[0]
  const $Navigation = () => inject($VirtualNavigation)[1]

  return [
    $Location,
    $Navigation
  ]
}

/**
 * Creates a current route matching page injection factory.
 * @param $Location - Injection factory for the route location record.
 * @param pages - Array of page match references.
 * @returns Tuple of page injection factory and stores preload injection factory.
 */
export function router$$<R extends Routes, K extends keyof R & string, P>(
  $Location: InjectionFactory<RouteLocationRecord<R>>,
  pages: PageMatchRef<NoInfer<K>, P>[]
): [
  InjectionFactory<ReadableSignal<P | null>>,
  InjectionFactory<StoresPreload>
]

/**
 * Creates a current route matching page and layout injection factory.
 * @param $Location - Injection factory for the route location record.
 * @param pages - Array of page and layout match references.
 * @param compose - Function to compose layouts with nested content.
 * @returns Tuple of page injection factory and stores preload injection factory.
 */
export function router$$<R extends Routes, K extends keyof R & string, P, N, L, C>(
  $Location: InjectionFactory<RouteLocationRecord<R>>,
  pages: (
    | PageMatchRef<NoInfer<K>, P>
    | LayoutMatchRef<NoInfer<K>, N, L>
  )[],
  compose: ($nested: ReadableSignal<N | null>, layout: L) => C
): [
  InjectionFactory<ReadableSignal<P | C | null>>,
  InjectionFactory<StoresPreload>
]

/* @__NO_SIDE_EFFECTS__ */
export function router$$(
  $Location: InjectionFactory<RouteLocationRecord<Routes>>,
  pages: UnknownMatchRef[],
  compose?: UnknownComposer
): [
  InjectionFactory<ReadableSignal<unknown>>,
  InjectionFactory<StoresPreload>
] {
  const $Router = () => router(
    inject($Location),
    pages,
    compose!
  )
  const $Page = () => inject($Router)[0]
  const $StoresToPreload = () => inject($Router)[1]

  return [
    $Page,
    $StoresToPreload
  ]
}
