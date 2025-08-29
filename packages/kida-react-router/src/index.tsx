import {
  type ReactNode,
  createContext,
  useContext
} from 'react'
import {
  type ReadableSignal,
  signal
} from 'kida'
import { useSignal } from '@kidajs/react'
import {
  type LayoutMatchRef,
  type PageMatchRef,
  type RouteMatchSignal,
  type Routes,
  match as bareMatch
} from '@kidajs/router'

export * from '@kidajs/router'

export type PageComponent = () => ReactNode

const OutletContext = /* @__PURE__ */ createContext<ReadableSignal<PageComponent | null>>(signal(null))

/**
 * Renders the nested page component within a layout.
 */
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
 * @param $route - Route match signal containing route and parameters
 * @param pages - Array of page and layout match references
 * @param compose - Function to compose layouts with nested content
 * @returns Computed signal containing the matched page, composed layout, or null
 */
/* @__NO_SIDE_EFFECTS__ */
export function match<R extends Routes, K extends keyof R & string>(
  $route: RouteMatchSignal<R>,
  pages: (
    | PageMatchRef<NoInfer<K>, PageComponent>
    | LayoutMatchRef<NoInfer<K>, PageComponent, PageComponent>
  )[]
): ReadableSignal<PageComponent | null> {
  return bareMatch($route, pages, compose)
}
