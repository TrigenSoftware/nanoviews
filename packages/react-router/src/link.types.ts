import type {
  AnchorHTMLAttributes,
  FocusEvent,
  MouseEvent
} from 'react'
import type {
  Routes,
  Paths
} from '@nano_kit/router'

export type LinkProps<R extends Routes, K extends keyof R & string> = AnchorHTMLAttributes<HTMLAnchorElement> & ((
  Paths<R>[K] extends infer P
    ? P extends (params?: infer Params) => string
      ? {
        /** Target route name */
        to: K
        /** Parameters for the route */
        params?: Params
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
          /** Parameters for the route */
          params: Params
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
  href?: string
})

export interface UsePreloadProps {
  onFocus?(event: FocusEvent): void
  onMouseEnter?(event: MouseEvent): void
  preload?: boolean
}

export interface LinkSettings {
  onClick(event: MouseEvent<HTMLAnchorElement>): void
  preloadByDefault?: boolean
  preloaded?: Set<string>
  usePreload?(
    props: UsePreloadProps,
    to: string | undefined,
    settings: Pick<LinkSettings, 'preloaded' | 'preloadByDefault'>
  ): Pick<Required<UsePreloadProps>, 'onFocus' | 'onMouseEnter'>
}
