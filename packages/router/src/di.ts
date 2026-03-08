import {
  type Accessor,
  DependencyNotFound,
  inject
} from '@nano_kit/store'
import type {
  AppRoutes,
  AppComponent
} from './di.types.js'
import type {
  Navigation,
  RouteLocationRecord
} from './navigation.js'
import type {
  MatchRef,
  PageRef
} from './router.js'
import {
  type Paths,
  buildPaths
} from './paths.js'

export * from './di.types.js'

/**
 * Global injection token for the current route location record.
 */
export function Location$(): RouteLocationRecord<AppRoutes> {
  throw new DependencyNotFound('Location$')
}

/**
 * Global injection token for the navigation API.
 */
export function Navigation$(): Navigation<AppRoutes> {
  throw new DependencyNotFound('Navigation$')
}

/**
 * Global injection token for the current page match reference.
 */
export function Page$(): Accessor<PageRef<AppComponent> | null> {
  throw new DependencyNotFound('Page$')
}

/**
 * Global injection token for the router page refs.
 */
export function Pages$(): MatchRef<string, AppComponent, AppComponent>[] {
  throw new DependencyNotFound('Pages$')
}

/**
 * Global injection token for the paths object built from the routes.
 * @returns Object with path generators for each route
 */
export function Paths$(): Paths<AppRoutes> {
  const navigation = inject(Navigation$)

  return buildPaths(navigation.routes)
}
