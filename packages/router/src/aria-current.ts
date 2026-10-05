import {
  type Accessor,
  $get,
  computed,
  inject,
  isEmpty
} from 'nanoviews/store'
import {
  type AppRoutes,
  type RouteLocation,
  type Routes,
  Location$,
  parseHref
} from '@nano_kit/router'
import type {
  LinkSettings,
  LinkSettingsHook
} from './link.types.js'
import { LinkSettings$ } from './link.js'

export type IsAriaCurrent<R extends Routes> = (url: URL | undefined, location: RouteLocation<R>) => boolean

export interface AriaCurrentSettings<R extends Routes> extends LinkSettings {
  isAriaCurrent?: IsAriaCurrent<R>
}

export function defaultIsAriaCurrent<R extends Routes>(
  url: URL | undefined,
  location: RouteLocation<R>
): boolean {
  return url?.pathname === location.pathname
}

/* @__NO_SIDE_EFFECTS__ */
function createAriaCurrent<R extends Routes>(
  getLocation: () => Accessor<RouteLocation<R>>,
  isAriaCurrent?: IsAriaCurrent<R>
): LinkSettingsHook<AriaCurrentSettings<R>> {
  return (
    {
      href,
      'aria-current': ariaCurrent
    },
    settings
  ) => {
    // An `aria-current` of the link's own stays as it is
    if (ariaCurrent === undefined) {
      const $location = getLocation()
      const finalIsAriaCurrent = settings.isAriaCurrent ?? isAriaCurrent ?? defaultIsAriaCurrent
      // The href is parsed when it changes, not on every navigation
      const $url = computed(() => {
        const value = $get(href)

        return isEmpty(value) ? undefined : parseHref(value)
      })

      return {
        // A navigation that leaves the answer as it was does not touch the attribute
        'aria-current': computed(() => (
          finalIsAriaCurrent($url(), $location())
            ? 'page'
            : undefined
        ))
      }
    }
  }
}

/**
 * Creates a hook for setting `aria-current="page"` based on current location.
 * @param $location - Accessor for the current route location.
 * @param isAriaCurrent - Custom predicate to determine whether the link is current.
 * @returns Hook to extend Link component with `aria-current`.
 */
/* @__NO_SIDE_EFFECTS__ */
export function ariaCurrent<R extends Routes>(
  $location: Accessor<RouteLocation<R>>,
  isAriaCurrent?: IsAriaCurrent<R>
) {
  return createAriaCurrent(() => $location, isAriaCurrent)
}

const applyAriaCurrent = /* @__PURE__ */ createAriaCurrent(() => inject(Location$))

/**
 * Enable automatic `aria-current` handling for Link component.
 * Should be used inside injection context with route location and navigation provided.
 * @param isAriaCurrent - Custom predicate to determine whether the link is current.
 */
export function enableLinkComponentAriaCurrent$(
  isAriaCurrent?: IsAriaCurrent<AppRoutes>
) {
  const settings: AriaCurrentSettings<AppRoutes> = inject(LinkSettings$)

  settings.isAriaCurrent = isAriaCurrent
  settings.addHook(applyAriaCurrent)
}
