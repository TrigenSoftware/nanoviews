import {
  type KeysOf,
  type ReadableSignal,
  type ValueOfKey,
  computed
} from 'kida'
import type {
  LocationRecord,
  RouteMatch,
  RouteMatchSignal,
  Routes
} from './types/index.js'
import {
  composeMatchers,
  removeTrailingSlash
} from './utils.js'

function createPatternRegex(pattern: string) {
  return new RegExp(`^${
    removeTrailingSlash(pattern)
      // Escape all special regex characters
      .replace(/[\s!#$()+,.:<=?[\\\]^{|}]/g, '\\$&')
      // /:param? -> (?:/(?<param>(?<=/)[^/]+))?
      .replace(/\/\\:(\w+)\\\?/g, '(?:/(?<$1>(?<=/)[^/]+))?')
      // /:param -> /(?<param>[^/]+)
      .replace(/\/\\:(\w+)/g, '/(?<$1>[^/]+)')
      // /* - > /(?<wildcard>.+)
      .replace(/\/\*$/g, '/(?<wildcard>.+)$')
  }$`, 'i')
}

function patternMatcher(this: RegExp, route: string, path: string) {
  const matches = path.match(this)

  if (!matches) {
    return null
  }

  const params: Record<string, string> = {}

  if (matches.groups) {
    Object.entries(matches.groups).forEach(([key, value]) => {
      params[key] = value
        ? decodeURIComponent(value)
        : ''
    })
  }

  return {
    route,
    params
  }
}

const nomatch = {
  route: null,
  params: {}
}

function createMatcher(routes: Routes) {
  return composeMatchers(Object.entries(routes).map(
    ([route, pattern]) => patternMatcher.bind(
      createPatternRegex(pattern),
      route
    )
  ), nomatch)
}

/**
 * Creates a computed signal that matches the current location against defined routes.
 * @param $location - Location signal record containing the current location state
 * @param routes - Object mapping route names to URL patterns
 * @returns A signal record containing the matched route and extracted parameters
 */
export function router<const R extends Routes>(
  $location: LocationRecord,
  routes: R
): RouteMatchSignal<R> {
  const match = createMatcher(routes)
  const { $pathname } = $location

  return computed(() => match($pathname())) as RouteMatchSignal<R>
}

/**
 * Creates a computed signal for a specific route parameter with optional parsing.
 * @param $route - Route match signal containing route and parameters
 * @param key - The parameter key to extract
 * @param parser - Optional function to parse the parameter value
 * @returns A computed signal that returns the parsed parameter value
 */
export function routeParam<
  const R extends Routes,
  M extends RouteMatch<R> = RouteMatch<R>,
  K extends KeysOf<M['params']> = KeysOf<M['params']>,
  V extends ValueOfKey<M['params'], K> = ValueOfKey<M['params'], K>,
  T = V
>(
  $route: RouteMatchSignal<R>,
  key: K,
  parser: (value: NoInfer<V>) => T = _ => _ as unknown as T
): ReadableSignal<T> {
  return computed(() => parser(($route().params as Record<K, V>)[key]))
}
