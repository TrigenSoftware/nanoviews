import type { AnyFn } from 'kida'
import type {
  Paths,
  Routes
} from './types/index.js'
import { removeTrailingSlash } from './utils.js'

function execPattern(
  this: (string | ((params: Record<string, string>) => string))[],
  params: Record<string, string>
) {
  return this
    .map((part, i) => (i % 2 === 0 ? part as string : (part as (params: Record<string, string>) => string)(params)))
    .join('')
}

function partToFunction(part: string, i: number) {
  return (
    i % 2 === 0
      ? part
      : part === undefined
        ? (params: Record<string, string> = {}) => (
          params.wildcard
            ? `/${params.wildcard}`
            : ''
        )
        : (params: Record<string, string> = {}) => (
          part in params
            ? `/${encodeURIComponent(params[part])}`
            : ''
        )
  )
}

function patternToFunction(pattern: string) {
  const parts = pattern
    .split(/\/(?::(\w+)\??|\*)/g)
    .map(partToFunction)

  return execPattern.bind(parts)
}

/**
 * Builds path generators from route definitions.
 * Creates functions or static strings for generating URLs from route patterns.
 * @param routes - Object mapping route names to URL patterns
 * @returns Object with path generators for each route
 */
export function buildPaths<const R extends Routes>(routes: R) {
  return Object.entries(routes).reduce<Record<string, string | AnyFn>>(
    (hrefs, [route, pattern]) => {
      if (/:|\*/.test(pattern)) {
        hrefs[route] = patternToFunction(pattern)
      } else {
        hrefs[route] = removeTrailingSlash(pattern)
      }

      return hrefs
    },
    {}
  ) as Paths<R>
}
