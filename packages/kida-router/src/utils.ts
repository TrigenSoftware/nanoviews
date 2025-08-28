import type {
  Location,
  NavigationUpdate,
  HrefObject
} from './types/index.js'

export function removeTrailingSlash(path: string) {
  return path.replace(/(.)\/($|\?)/, '$1$2')
}

export function parseHref(href: string) {
  return new URL(removeTrailingSlash(href), 'http://a')
}

export function getHref(location: HrefObject): string {
  return removeTrailingSlash(location.pathname + location.search + location.hash)
}

export function updateHrefObject(
  href: HrefObject,
  update: NavigationUpdate
): Location {
  const updatedUrl = parseHref(update.pathname ?? href.pathname)

  updatedUrl.search = update.search ?? href.search
  updatedUrl.hash = update.hash ?? href.hash

  if (update.searchParams) {
    updatedUrl.search = update.searchParams.toString()
  }

  return {
    pathname: updatedUrl.pathname,
    search: updatedUrl.search,
    hash: updatedUrl.hash,
    href: getHref(updatedUrl)
  }
}

/**
 * Updates an href string with navigation changes.
 * @param href - The original href string to update
 * @param update - Navigation update object containing new pathname, search, hash, or searchParams
 * @returns Updated href string
 */
export function updateHref(href: string, update: NavigationUpdate): string {
  return updateHrefObject(parseHref(href), update).href
}

export function composeMatchers<V = string | null, R = unknown, N = null>(
  matchers: ((value: V) => R | N)[],
  nomatch: N = null as N
) {
  const len = matchers.length

  return (value: V) => {
    for (let i = 0, result; i < len; i++) {
      if (result = matchers[i](value)) {
        return result
      }
    }

    return nomatch
  }
}
