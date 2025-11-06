import {
  type AnyAccessor,
  type ReadableSignal
} from 'kida'

export type StoresPreload = () => AnyAccessor[]

export interface ViewRef<C> {
  /**
   * The component or value of the view.
   */
  c: C | undefined
  /**
   * Optional function to preload stores associated with the view.
   */
  s?: StoresPreload
  /**
   * Indicates if the view is loading.
   */
  l?: boolean
}

export type ViewRefGetter<C> = (tasks?: Set<Promise<unknown> | null>) => ViewRef<C>

export interface PageMatchRef<R extends string | null, P> {
  /**
   * The expected route name to match.
   */
  e: R
  /**
   * Function to get the view reference for the matched page.
   */
  p: ViewRefGetter<P>
}

export interface LayoutMatchRef<R extends string, P, L> {
  /**
   * Function to get the view reference for the layout.
   */
  l: ViewRefGetter<L>
  /**
   * Children match references for nested routes.
   */
  p: MatchRef<R, P, L>[]
}

export type MatchRef<R extends string, P, L> =
  | PageMatchRef<R, P>
  | PageMatchRef<null, P>
  | LayoutMatchRef<R, P, L>

export interface ViewModule<C> {
  default: C
  storesToPreload?: StoresPreload
}

export type ViewModuleLoader<P> = () => Promise<ViewModule<P>>

export interface LoadableRef<P> {
  /**
   * Function to load the view module asynchronously.
   */
  g: ViewRefGetter<P>
}

export type UnknownPageMatchRef = PageMatchRef<string, unknown> | PageMatchRef<null, unknown>

export type UnknownLayoutMatchRef = LayoutMatchRef<string, unknown, unknown>

export type UnknownMatchRef = MatchRef<string, unknown, unknown>

export type UnknownComposer = ($nested: ReadableSignal<unknown>, layout: unknown) => unknown
