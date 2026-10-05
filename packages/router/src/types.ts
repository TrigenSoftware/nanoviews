import type { Child } from 'nanoviews'

/**
 * A page or layout view: the call with no arguments renders it.
 */
export type PageComponent = () => Child

declare module '@nano_kit/router' {
  interface AppContext {
    component: PageComponent
  }
}
