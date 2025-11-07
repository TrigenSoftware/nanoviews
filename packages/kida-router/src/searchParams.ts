import {
  type ReadableSignal,
  computed
} from 'kida'
import type {
  RouteLocationRecord,
  Routes,
  SearchParamsSignal
} from './types/index.js'

/**
 * Creates a computed signal that provides access to URL search parameters.
 * @param $location - Location signal record containing the current location state
 * @returns A computed signal that returns URLSearchParams instance
 */
/* @__NO_SIDE_EFFECTS__ */
export function searchParams($location: RouteLocationRecord<Routes>): SearchParamsSignal {
  const { $search } = $location

  return computed(() => new URLSearchParams($search()))
}

/**
 * Creates a computed signal for a specific search parameter with optional parsing.
 * @param $searchParams - Search parameters signal
 * @param key - The parameter key to extract
 * @param parser - Optional function to parse the parameter value
 * @returns A computed signal that returns the parsed parameter value
 */
/* @__NO_SIDE_EFFECTS__ */
export function searchParam<T = string | null>(
  $searchParams: SearchParamsSignal,
  key: string,
  parser: (value: string | null) => T = _ => _ as T
): ReadableSignal<T> {
  return computed(() => parser($searchParams().get(key)))
}
