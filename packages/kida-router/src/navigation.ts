import {
  type Destroy,
  atIndex,
  endBatch,
  onMount,
  readonly,
  record,
  signal,
  startBatch,
  updateList
} from 'kida'
import type {
  Location,
  LocationRecord,
  Navigation,
  NavigationUpdate,
  VirtualAction,
  VirtualLocation,
  VirtualLocationRecord
} from './types/index.js'
import {
  getHref,
  parseHref,
  removeTrailingSlash,
  updateHref,
  updateHrefObject
} from './utils.js'

function getBrowserLocationState(prevLocation?: Location): Location {
  const href = getHref(location)

  if (prevLocation?.href === href) {
    return prevLocation
  }

  return {
    hash: location.hash,
    pathname: location.pathname,
    search: location.search,
    href
  }
}

function getNavigationUrl(to: string | NavigationUpdate): string {
  if (typeof to === 'string') {
    return removeTrailingSlash(to)
  }

  return updateHref(location.href, to)
}

function getVirtualNavigationState(
  location: Location,
  to: string | NavigationUpdate,
  action: VirtualAction
): VirtualLocation {
  const update = typeof to === 'string'
    ? parseHref(to)
    : to
  const hrefObject = updateHrefObject(location, update)

  return {
    ...hrefObject,
    action
  }
}

/**
 * Sets up event handlers to intercept link clicks and perform navigation
 * through the router instead of default browser behavior.
 * @param navigation - Navigation object for performing transitions
 * @returns Function to remove event handlers
 */
export function listenLinks(navigation: Navigation) {
  const onLinkClick = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest('a')

    if (
      link
      && event.button === 0 // Left mouse button
      && link.target !== '_blank' // Not for new tab
      && link.origin === location.origin // Not external link
      && link.rel !== 'external' // Not external link
      && link.target !== '_self' // Now manually disabled
      && !link.download // Not download link
      && !event.altKey // Not download link by user
      && !event.metaKey // Not open in new tab by user
      && !event.ctrlKey // Not open in new tab by user
      && !event.shiftKey // Not open in new window by user
      && !event.defaultPrevented // Click was not cancelled
    ) {
      event.preventDefault()

      const hashChanged = location.hash !== link.hash

      navigation.push(link.href)

      if (hashChanged) {
        location.hash = link.hash

        if (link.hash === '' || link.hash === '#') {
          window.dispatchEvent(new HashChangeEvent('hashchange'))
        }
      }
    }
  }

  document.body.addEventListener('click', onLinkClick)

  return () => {
    document.body.removeEventListener('click', onLinkClick)
  }
}

/**
 * Creates navigation based on browser History API.
 * Synchronizes routing state with browser URL.
 * @param enhance - Optional function to extend navigation functionality
 * @returns Tuple of current location signal and navigation methods
 */
/* @__NO_SIDE_EFFECTS__ */
export function browserNavigation(
  enhance?: (navigation: Navigation) => Destroy
): [LocationRecord, Navigation] {
  const $location = signal<Location>(getBrowserLocationState())
  const update = () => {
    $location(getBrowserLocationState($location()))
  }
  const navigation = {
    go(steps: number) {
      history.go(steps)
    },
    back() {
      history.back()
    },
    forward() {
      history.forward()
    },
    push(to: string | NavigationUpdate) {
      const currentHref = getHref(location)
      const nextHref = getNavigationUrl(to)

      if (currentHref !== nextHref) {
        history.pushState(null, '', nextHref)
        update()
      }
    },
    replace(to: string | NavigationUpdate) {
      const currentHref = getHref(location)
      const nextHref = getNavigationUrl(to)

      if (currentHref !== nextHref) {
        history.replaceState(null, '', nextHref)
        update()
      }
    }
  }

  onMount($location, () => {
    update()

    window.addEventListener('popstate', update)
    window.addEventListener('hashchange', update)

    const destroy = enhance?.(navigation)

    return () => {
      destroy?.()
      window.removeEventListener('popstate', update)
      window.removeEventListener('hashchange', update)
    }
  })

  return [record(readonly($location)), navigation] as const
}

/**
 * Creates virtual navigation without synchronization with browser URL.
 * Useful for SSR or testing purposes.
 * @param initialPath - Initial path for the virtual location
 * @param enhance - Optional function to extend navigation functionality
 * @returns Tuple of current virtual location signal and navigation methods
 */
/* @__NO_SIDE_EFFECTS__ */
export function virtualNavigation(
  initialPath = '/',
  enhance?: (navigation: Navigation) => Destroy
): [VirtualLocationRecord, Navigation] {
  const $history = signal<VirtualLocation[]>([getVirtualNavigationState(parseHref(initialPath), {}, null)])
  const $activeIndex = signal(0)
  const $location = atIndex($history, $activeIndex)
  const navigation = {
    go(steps: number) {
      const newIndex = Math.max(0, Math.min(
        $history().length - 1,
        $activeIndex() + steps
      ))

      $activeIndex(newIndex)
    },
    back() {
      navigation.go(-1)
    },
    forward() {
      navigation.go(1)
    },
    push(to: string | NavigationUpdate) {
      const activeIndex = $activeIndex()
      const currentLocation = $location()
      const nextLocation = getVirtualNavigationState(currentLocation, to, 'push')

      if (currentLocation.href !== nextLocation.href) {
        const nextIndex = activeIndex + 1

        startBatch()
        updateList($history, (history) => {
          history.splice(nextIndex, history.length - activeIndex - 1, nextLocation)
        })
        $activeIndex(nextIndex)
        endBatch()
      }
    },
    replace(to: string | NavigationUpdate) {
      const currentLocation = $location()
      const nextLocation = getVirtualNavigationState(currentLocation, to, 'replace')

      if (currentLocation.href !== nextLocation.href) {
        $location(nextLocation)
      }
    }
  }

  onMount($location, () => enhance?.(navigation))

  return [record(readonly($location)), navigation]
}

