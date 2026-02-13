import {
  paced,
  debounce,
  external,
  onMount,
  effect,
  untracked,
  mountable,
  computed,
  Destroy,
  atIndex,
  inject
} from '@nano_kit/store'
import { queryKey } from '@nano_kit/query'
import type { City } from '../services/types.js'
import * as Cities from '../services/cities.js'
import * as Location from '../services/location.js'
import { QueryClient$ } from './query.js'

const INPUT_DEBOUNCE = 300

export function LocationSearch$() {
  const { query } = inject(QueryClient$)
  const $searchQuery = mountable(external<string>(($locationSearchQuery) => {
    $locationSearchQuery(localStorage.getItem('locationSearch') || '')

    return (nextValue) => {
      $locationSearchQuery(nextValue)
      localStorage.setItem('locationSearch', untracked($locationSearchQuery))
    }
  }))
  const $searchQueryPaced = paced($searchQuery, debounce(INPUT_DEBOUNCE))
  const [$geolocation] = query<[], City | null>(queryKey('geolocation'), [], () => Location.fetchCurrentCity())

  onMount($searchQuery, () => {
    let stop: Destroy | undefined

    if (!$searchQuery()) {
      stop = effect(() => {
        const geolocation = $geolocation()

        if (geolocation && !untracked($searchQuery)) {
          $searchQuery(geolocation.label)
          stop!()
        }
      })
    }

    return stop
  })

  return {
    $searchQuery,
    $searchQueryPaced
  }
}

export function CitySuggestions$() {
  const { query } = inject(QueryClient$)
  const { $searchQuery } = inject(LocationSearch$)
  const [$suggestionsData] = query<[query: string], City[]>(queryKey('citySuggestions'), [$searchQuery], async (queryValue) => {
    if (!queryValue.trim()) {
      return []
    }

    return await Cities.fetchCities(queryValue)
  })
  const $suggestions = computed(() => $suggestionsData() || [])
  const $currentLocation = atIndex($suggestions, 0)

  return {
    $suggestions,
    $currentLocation
  }
}
