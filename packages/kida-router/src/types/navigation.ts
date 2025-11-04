import type { ReadableSignal } from 'kida'
import type {
  UrlHrefObject,
  UrlUpdate
} from './common.js'
import type {
  RouteLocation,
  Routes
} from './location.js'

export type HistoryAction = 'push' | 'replace' | 'pop' | null

export interface Location extends UrlHrefObject {
  action: HistoryAction
}

/**
 * Navigation interface for managing route transitions.
 */
export interface Navigation {
  /**
   * Handle a transition between two locations.
   * You can redefine this method to perform custom actions like transition confirmation.
   * @param fn - Function to execute during the transition.
   * @param nextLocation - The next location to navigate to, or null.
   * @param prevLocation - The previous location.
   */
  transition<R extends Routes = Routes>(
    fn: (
      nextLocation: RouteLocation<R> | null
    ) => void,
    nextLocation: RouteLocation<R> | null,
    prevLocation: RouteLocation<R>
  ): void
  /**
   * Number of entries in the history stack.
   */
  length: number
  /**
   * Navigate back in history.
   */
  back(): void
  /**
   * Navigate forward in history.
   */
  forward(): void
  /**
   * Navigate to a new URL by pushing a new entry onto the history stack.
   * @param to - The target URL as a string or UrlUpdate object with partial URL components.
   */
  push(to: string | UrlUpdate): void
  /**
   * Navigate to a new URL by replacing the current entry in the history stack.
   * @param to - The target URL as a string or UrlUpdate object with partial URL components.
   */
  replace(to: string | UrlUpdate): void
}

export type LocationSignal = ReadableSignal<Location>

export type SearchParamsSignal = ReadableSignal<URLSearchParams>
