import type { Signalish } from 'nanoviews/store'
import type {
  Attributes,
  ComponentInstance,
  MouseEventHandler
} from 'nanoviews'
import type {
  Routes,
  Paths
} from '@nano_kit/router'

export type LinkProps<R extends Routes, K extends keyof R & string> = Attributes<'a'> & ((
  Paths<R>[K] extends infer P
    ? P extends (params?: infer Params) => string
      ? {
        /** Target route name */
        to: K
        /** Parameters for the route, or an accessor of them to follow */
        params?: Signalish<Params>
        /**
         * Whether to preload the page on hover or focus.
         * Notice: Link should be created with preloadable hook.
         */
        preload?: boolean
        href?: never
      }
      : P extends (params: infer Params) => string
        ? {
          /** Target route name */
          to: K
          /** Parameters for the route, or an accessor of them to follow */
          params: Signalish<Params>
          /**
           * Whether to preload the page on hover or focus.
           * Notice: Link should be created with preloadable hook.
           */
          preload?: boolean
          href?: never
        }
        : {
          /** Target route name */
          to: K
          params?: never
          /**
           * Whether to preload the page on hover or focus.
           * Notice: Link should be created with preloadable hook.
           */
          preload?: boolean
          href?: never
        }
    : never
) | {
  to?: never
  params?: never
  preload?: never
})

export type LinkComponent<R extends Routes> = <K extends keyof R & string>(
  props: LinkProps<R, K>
) => ComponentInstance

/**
 * Props of a link as its hooks see them: `href` is resolved from the route.
 */
export interface LinkHookProps extends Attributes<'a'> {
  to?: string
  params?: unknown
  preload?: boolean
}

/**
 * Extends the Link component: called on the render of every link, returns
 * attributes to add to its anchor.
 */
export type LinkSettingsHook<S extends LinkSettings = LinkSettings> = (
  props: LinkHookProps,
  settings: S
) => Attributes<'a'> | undefined

export interface LinkSettings {
  hook?: LinkSettingsHook
  onClick: MouseEventHandler<HTMLAnchorElement>
  addHook<S extends LinkSettings>(hook: LinkSettingsHook<S>): void
}
