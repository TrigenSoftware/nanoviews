import {
  inject,
  isAccessor,
  isFunction
} from 'nanoviews/store'
import {
  a,
  component$,
  effect$
} from 'nanoviews'
import {
  type AppRoutes,
  type Navigation,
  type Paths,
  type Routes,
  Navigation$,
  Paths$,
  listenLinks,
  onLinkClick
} from '@nano_kit/router'
import type {
  LinkComponent,
  LinkHookProps,
  LinkSettings,
  LinkSettingsHook
} from './link.types.js'

export type * from './link.types.js'

/* @__NO_SIDE_EFFECTS__ */
function createLinkComponent<R extends Routes>(
  getSettings: () => LinkSettings,
  getPaths: () => Paths<R>
) {
  return component$((props: LinkHookProps, children) => {
    const settings = getSettings()
    const {
      to,
      params,
      preload,
      onClick,
      ...attributes
    } = props

    if (to) {
      const path = (getPaths() as Record<string, string | ((params: unknown) => string)>)[to]

      attributes.href = isFunction(path)
        ? isAccessor(params)
          ? () => path(params())
          : path(params)
        : path
    }

    return a({
      ...attributes,
      onClick(event) {
        onClick?.(event)
        settings.onClick(event)
      },
      ...settings.hook?.({
        ...props,
        href: attributes.href
      }, settings)
    })(...children)
  }) as LinkComponent<R>
}

function createLinkSettings<R extends Routes>(navigation: Navigation<R>) {
  // A hook is added from a render, and a render runs again every time its
  // view is built: the same hook is added once
  const seen = new Set<LinkSettingsHook>()
  const settings = {
    onClick: onLinkClick.bind(navigation as unknown as Navigation),
    addHook(hook: LinkSettingsHook) {
      if (!seen.has(hook)) {
        const prevHook = settings.hook

        seen.add(hook)
        settings.hook = prevHook
          ? (props, settings) => ({
            ...prevHook(props, settings),
            ...hook(props, settings)
          })
          : hook
      }
    }
  } as LinkSettings

  return settings
}

/**
 * Listen raw link clicks on the document to navigate without Link component, while the view is mounted.
 * @param navigation - Router navigation object
 */
export function listenNavigationLinks$<R extends Routes = Routes>(navigation: Navigation<R>) {
  effect$(() => listenLinks(navigation))
}

/**
 * Listen raw link clicks on the document to navigate without Link component, while the view is mounted.
 * Should be used inside injection context with navigation provided.
 */
export function listenLinks$() {
  listenNavigationLinks$(inject(Navigation$))
}

/**
 * Creates a Link component for navigation.
 * @param navigation - Router navigation object
 * @param paths - Path builders for routes
 * @param hooks - Link settings hooks
 * @returns Link component for navigation.
 */
/* @__NO_SIDE_EFFECTS__ */
export function linkComponent<R extends Routes>(
  navigation: Navigation<R>,
  paths: Paths<R>,
  hooks?: LinkSettingsHook[]
) {
  const settings = createLinkSettings(navigation)

  hooks?.forEach(settings.addHook)

  return createLinkComponent(() => settings, () => paths)
}

/**
 * Injection token for the settings of the Link component.
 * @returns Link settings bound to the navigation from the injection context
 */
export function LinkSettings$(): LinkSettings {
  return createLinkSettings(inject(Navigation$))
}

/**
 * Link component for navigation.
 * Should be used inside injection context with navigation provided.
 */
export const Link: LinkComponent<AppRoutes> = /* @__PURE__ */ createLinkComponent<AppRoutes>(
  () => inject(LinkSettings$),
  () => inject(Paths$)
)
