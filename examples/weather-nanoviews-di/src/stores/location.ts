import {
  signal,
  paced,
  debounce,
  external,
  atIndex,
  onMountEffect,
  onMount,
  channel,
  $TasksSet,
  inject,
  untracked,
  mountable
} from 'nanoviews/store'
import type { City } from '../services/types.js'
import * as Cities from '../services/cities.js'
import * as Location from '../services/location.js'

const INPUT_DEBOUNCE = 300

export function LocationSearchStore() {
  const $locationSearch = mountable(external<string>(($locationSearch) => {
    $locationSearch(localStorage.getItem('locationSearch') || '')

    return (nextValue) => {
      $locationSearch(nextValue)
      localStorage.setItem('locationSearch', untracked($locationSearch))
    }
  }))

  async function fetchCurrentCity() {
    const city = await Location.fetchCurrentCity()

    if (!$locationSearch() && city) {
      $locationSearch(city.label)
    }
  }

  onMount($locationSearch, () => {
    if (!$locationSearch()) {
      fetchCurrentCity()
    }
  })

  return $locationSearch
}

export function LocationSearchPacedStore() {
  const $locationSearch = inject(LocationSearchStore)

  return paced($locationSearch, debounce(INPUT_DEBOUNCE))
}

export function CitySuggestionsStore() {
  const $locationSearch = inject(LocationSearchStore)
  const $citySuggestions = mountable(signal<City[]>([]))
  const tasks = inject($TasksSet)
  const [citySuggestionsTask] = channel(tasks)

  function fetchCitySuggestions(query: string) {
    return citySuggestionsTask(async (signal) => {
      if (query.trim()) {
        $citySuggestions(await Cities.fetchCities(query, signal))
      } else {
        $citySuggestions([])
      }
    })
  }

  onMountEffect($citySuggestions, () => {
    fetchCitySuggestions($locationSearch())
  })

  return $citySuggestions
}

export function CurrentLocationStore() {
  const $citySuggestions = inject(CitySuggestionsStore)
  const $currentLocation = atIndex($citySuggestions, 0)

  return $currentLocation
}
