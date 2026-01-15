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
  atIndex
} from '@nano_kit/store'
import { queryKey } from '@nano_kit/query'
import type { City } from '../services/types.js'
import * as Cities from '../services/cities.js'
import * as Location from '../services/location.js'
import { query } from './query.js'

const INPUT_DEBOUNCE = 300

export const $locationSearchQuery = mountable(external<string>(($locationSearchQuery) => {
  $locationSearchQuery(localStorage.getItem('locationSearch') || '')

  return (nextValue) => {
    $locationSearchQuery(nextValue)
    localStorage.setItem('locationSearch', untracked($locationSearchQuery))
  }
}))

export const $locationSearchQueryPaced = paced($locationSearchQuery, debounce(INPUT_DEBOUNCE))

export const [$geolocation] = query<[], City | null>(queryKey('geolocation'), [], () => Location.fetchCurrentCity())

onMount($locationSearchQuery, () => {
  let stop: Destroy | undefined

  if (!$locationSearchQuery()) {
    stop = effect(() => {
      const geolocation = $geolocation()

      if (geolocation && !untracked($locationSearchQuery)) {
        $locationSearchQuery(geolocation.label)
        stop!()
      }
    })
  }

  return stop
})

export const [
  $citySuggestionsData,
  $citySuggestionsError,
  $citySuggestionsLoading
] = query<[query: string], City[]>(queryKey('citySuggestions'), [$locationSearchQuery], async (query) => {
  if (!query.trim()) {
    return []
  }

  return await Cities.fetchCities(query)
})

export const $citySuggestions = computed(() => $citySuggestionsData() || [])

export const $currentLocation = atIndex($citySuggestions, 0)
