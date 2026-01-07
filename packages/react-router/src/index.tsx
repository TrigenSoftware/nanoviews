import {
  type ReactNode,
  type FocusEvent,
  type MouseEvent,
  type AnchorHTMLAttributes,
  useMemo,
  createContext,
  useContext,
  useCallback
} from 'react'
import {
  type InjectionFactory,
  type ReadableSignal,
  signal
} from '@nano_kit/store'
import {
  useSignal,
  useInject
} from '@nano_kit/react'
import {
  type LayoutMatchRef,
  type Navigation,
  type PageMatchRef,
  type Paths,
  type RouteLocationRecord,
  type Routes,
  type StoresPreload,
  type UnknownMatchRef,
  loadPage,
  onLinkClick,
  router as vanillaRouter,
  router$ as vanillaRouter$
} from '@nano_kit/router'

export * from '@nano_kit/router'

export type PageComponent = () => ReactNode

const OutletContext = /* @__PURE__ */ createContext<ReadableSignal<PageComponent | null>>(
  signal(null)
)

/**
 * Renders the nested page component within a layout.
 */
/* @__NO_SIDE_EFFECTS__ */
export function Outlet() {
  const $nested = useContext(OutletContext)
  const Nested = useSignal($nested)

  return Nested ? <Nested/> : null
}

function compose(
  $nested: ReadableSignal<PageComponent | null>,
  Layout: PageComponent
) {
  const { Provider } = OutletContext

  return () => (
    <Provider value={$nested}>
      <Layout/>
    </Provider>
  )
}

/**
 * Creates a computed signal that matches the current route against page and layout definitions.
 * Supports nested layouts with composition function for combining layouts with nested content.
 * @param $location - Route match signal containing route and parameters
 * @param pages - Array of page and layout match references
 * @returns Tuple of computed signal containing the matched page or composed layout and function to preload stores
 */
/* @__NO_SIDE_EFFECTS__ */
export function router<R extends Routes, K extends keyof R & string>(
  $location: RouteLocationRecord<R>,
  pages: (
    | PageMatchRef<NoInfer<K>, PageComponent>
    | PageMatchRef<null, PageComponent>
    | LayoutMatchRef<NoInfer<K>, PageComponent, PageComponent>
  )[]
): [ReadableSignal<PageComponent | null>, StoresPreload] {
  return vanillaRouter($location, pages, compose)
}

/**
 * Creates a current route matching page and layout injection factory.
 * @param Location$ - Injection factory for the route location record.
 * @param pages - Array of page and layout match references.
 * @returns Tuple of page injection factory and stores preload injection factory.
 */
export function router$<R extends Routes, K extends keyof R & string>(
  Location$: InjectionFactory<RouteLocationRecord<R>>,
  pages: (
    | PageMatchRef<NoInfer<K>, PageComponent>
    | PageMatchRef<null, PageComponent>
    | LayoutMatchRef<NoInfer<K>, PageComponent, PageComponent>
  )[]
): [
  InjectionFactory<ReadableSignal<PageComponent | null>>,
  InjectionFactory<StoresPreload>
] {
  return vanillaRouter$(Location$, pages, compose)
}

/**
 * Creates a React application component that renders the matched page based on the current route.
 * @param $location - Current location signal.
 * @param pages - Array of page and layout match references.
 * @returns React application component.
 */
export function app<R extends Routes, K extends keyof R & string>(
  $location: RouteLocationRecord<R>,
  pages: (
    | PageMatchRef<NoInfer<K>, PageComponent>
    | PageMatchRef<null, PageComponent>
    | LayoutMatchRef<NoInfer<K>, PageComponent, PageComponent>
  )[]
) {
  const [$page] = router($location, pages)

  /**
   * React application component.
   */
  return function App() {
    const Page = useSignal($page)

    return Page && <Page/>
  }
}

/**
 * Creates a React application component that renders the matched page based on the current route.
 * Notice: App should be used within a dependency injection context.
 * @param Location$ - Injection factory for the route location record.
 * @param pages - Array of page and layout match references.
 * @returns React application component and stores preload injection factory.
 */
export function app$<R extends Routes, K extends keyof R & string>(
  Location$: InjectionFactory<RouteLocationRecord<R>>,
  pages: (
    | PageMatchRef<NoInfer<K>, PageComponent>
    | PageMatchRef<null, PageComponent>
    | LayoutMatchRef<NoInfer<K>, PageComponent, PageComponent>
  )[]
) {
  const [Page$, StoresToPreload$] = router$(Location$, pages)

  /**
   * React application component.
   */
  return [
    function App() {
      const $page = useInject(Page$)
      const Page = useSignal($page)

      return Page && <Page/>
    },
    StoresToPreload$
  ] as const
}

/**
 * Creates a preload hook for preloading pages on user interaction.
 * @param pages - Array of page and layout match references.
 * @param preloadByDefault - Whether to preload pages by default.
 * @returns Hook function to use for preloading pages.
 */
export function preloadable(
  pages: UnknownMatchRef[],
  preloadByDefault = false
) {
  const preloaded = new Set<string>()

  /**
   * Hook to preload pages on user interaction.
   * @param props - Event handlers for focus and mouse enter.
   * @param to - Target route to preload.
   * @param preload - Flag indicating whether to preload.
   * @returns Event handlers for preloading.
   */
  return function usePreload(
    {
      onFocus,
      onMouseEnter
    }: {
      onFocus?(event: FocusEvent): void
      onMouseEnter?(event: MouseEvent): void
    },
    to: string | undefined,
    preload = preloadByDefault
  ) {
    const preloadCallback = useCallback(() => {
      if (to && preload && !preloaded.has(to)) {
        preloaded.add(to)
        void loadPage(pages, to)
      }
    }, [to, preload])
    const onFocusCallback = useCallback((event: FocusEvent) => {
      preloadCallback()
      onFocus?.(event)
    }, [onFocus, preloadCallback])
    const onMouseEnterCallback = useCallback((event: MouseEvent) => {
      preloadCallback()
      onMouseEnter?.(event)
    }, [onMouseEnter, preloadCallback])

    return {
      onFocus: onFocusCallback,
      onMouseEnter: onMouseEnterCallback
    }
  }
}

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

function createLink<R extends Routes>(
  useOnClick: () => (event: MouseEvent<HTMLAnchorElement>) => void,
  paths: Paths<R>,
  usePreload?: ReturnType<typeof preloadable>
) {
  /**
   * Link component for navigation.
   * @param props - Link properties including target route, parameters, and event handlers.
   * @returns Anchor element for navigation.
   */
  return function Link<K extends keyof R & string>(props: LinkProps<R, K>) {
    const {
      to,
      preload,
      href: hrefProp,
      onClick: onClickProp,
      params,
      ...restProps
    } = props
    const onClick = useOnClick()
    const path = to && paths[to]
    const href = hrefProp ?? (path && (
      typeof path === 'function'
        ? path(params)
        : path
    ))
    const onClickCallback = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
      onClick(event)
      onClickProp?.(event)
    }, [onClick, onClickProp])

    return (
      <a
        href={href}
        onClick={onClickCallback}
        {...restProps}
        {...usePreload?.(restProps, to, preload)}
      />
    )
  }
}

/**
 * Creates a Link component for navigation.
 * @param navigation - Router navigation object
 * @param paths - Path builders for routes
 * @param usePreload - Preload hook for preloading pages
 * @returns Link component for navigation.
 */
export function link<R extends Routes>(
  navigation: Navigation,
  paths: Paths<R>,
  usePreload?: ReturnType<typeof preloadable>
) {
  const onClick = onLinkClick.bind(navigation)

  return createLink(() => onClick, paths, usePreload)
}

/**
 * Creates a Link component for navigation.
 * Notice: Link should be used within a dependency injection context.
 * @param Navigation$ - Injection factory for the navigation object.
 * @param paths - Path builders for routes
 * @param usePreload - Preload hook for preloading pages
 * @returns Link component for navigation.
 */
export function link$<R extends Routes>(
  Navigation$: InjectionFactory<Navigation>,
  paths: Paths<R>,
  usePreload?: ReturnType<typeof preloadable>
) {
  return createLink(() => {
    const navigation = useInject(Navigation$)

    return useMemo(() => onLinkClick.bind(navigation), [navigation])
  }, paths, usePreload)
}
