import {
  inject,
  isFunction
} from 'nanoviews/store'
import {
  type UnknownMatchRef,
  Pages$,
  loadPage
} from '@nano_kit/router'
import type {
  LinkSettings,
  LinkSettingsHook
} from './link.types.js'
import { LinkSettings$ } from './link.js'

export interface PreloadSettings extends LinkSettings {
  preloaded?: Set<string>
  preloadByDefault?: boolean
}

/* @__NO_SIDE_EFFECTS__ */
function createPreloadHook(
  getPages: () => UnknownMatchRef[],
  preloadByDefault = false
): LinkSettingsHook<PreloadSettings> {
  return (
    {
      onFocus,
      onMouseEnter,
      preload,
      to
    },
    settings
  ) => {
    // A link that does not preload gets no listeners at all
    if (to && (preload ?? settings.preloadByDefault ?? preloadByDefault)) {
      const pages = getPages()
      const preloaded = settings.preloaded ??= new Set<string>()
      const preloadPage = () => {
        if (!preloaded.has(to)) {
          preloaded.add(to)
          void loadPage(pages, to)
        }
      }

      return {
        onFocus(event) {
          onFocus?.(event)
          preloadPage()
        },
        onMouseEnter(event) {
          onMouseEnter?.(event)
          preloadPage()
        }
      }
    }
  }
}

/**
 * Creates a preload hook for preloading pages on user interaction.
 * @param pages - Array of page and layout match references, or a function that returns it.
 * @param preloadByDefault - Whether to preload pages by default.
 * @returns Hook to extend Link component with preloading.
 */
/* @__NO_SIDE_EFFECTS__ */
export function preloadable(
  pages: UnknownMatchRef[] | (() => UnknownMatchRef[]),
  preloadByDefault = false
) {
  return createPreloadHook(isFunction(pages) ? pages : () => pages, preloadByDefault)
}

const preload = /* @__PURE__ */ createPreloadHook(() => inject(Pages$))

/**
 * Enable link preloading capabilities for Link component.
 * Should be used inside injection context with navigation and pages provided.
 * @param preloadByDefault - Whether to preload pages by default.
 */
export function enableLinkComponentPreload$(preloadByDefault = false) {
  const settings: PreloadSettings = inject(LinkSettings$)

  settings.preloadByDefault = preloadByDefault
  settings.addHook(preload)
}
