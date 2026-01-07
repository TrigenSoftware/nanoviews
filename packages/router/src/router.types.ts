import type {
  AnyAccessor,
  ReadableSignal
} from '@nano_kit/store'

export type StoresPreload = () => AnyAccessor[]

export interface ViewRef<V> {
  /**
   * The component or value of the view.
   */
  view: V | undefined
  /**
   * Optional function to preload stores associated with the view.
   */
  storesToPreload?: StoresPreload
  /**
   * Indicates if the view is loading.
   */
  loading?: boolean
}

export type ViewRefGetter<V> = (tasks?: Set<Promise<unknown> | null>) => ViewRef<V>

export interface PageMatchRef<R extends string | null, P> {
  /**
   * The expected route name to match.
   */
  expected: R
  /**
   * Function to get the view reference for the matched page.
   */
  page: ViewRefGetter<P>
}

export interface LayoutMatchRef<R extends string, P, L> {
  /**
   * Function to get the view reference for the layout.
   */
  layout: ViewRefGetter<L>
  /**
   * Children match references for nested routes.
   */
  pages: MatchRef<R, P, L>[]
}

export type MatchRef<R extends string, P, L> =
  | PageMatchRef<R, P>
  | PageMatchRef<null, P>
  | LayoutMatchRef<R, P, L>

export interface ViewModule<V> {
  default: V
  storesToPreload?: StoresPreload
}

export type ViewModuleLoader<P> = () => Promise<ViewModule<P>>

export interface LoadableRef<P> {
  /**
   * Function to load the view module asynchronously.
   */
  load: ViewRefGetter<P>
}

export type UnknownPageMatchRef = PageMatchRef<string, unknown> | PageMatchRef<null, unknown>

export type UnknownLayoutMatchRef = LayoutMatchRef<string, unknown, unknown>

export type UnknownMatchRef = MatchRef<string, unknown, unknown>

export type UnknownComposer = ($nested: ReadableSignal<unknown>, layout: unknown) => unknown
