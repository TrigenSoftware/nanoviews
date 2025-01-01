import {
  signal,
  lazy,
  onChange,
  atIndex,
  effect,
  onMount,
  batch,
  channel,
  Tasks,
  inject
} from 'nanoviews/store'
import type { City } from '../services/types.js'
import * as Cities from '../services/cities.js'
import * as Location from '../services/location.js'

const INPUT_DEBOUNCE = 300

export function LocationSearchStore() {
  const $locationSearch = lazy(
    () => localStorage.getItem('locationSearch') || ''
  )

  async function fetchCurrentCity() {
    const city = await Location.fetchCurrentCity()

    if (!$locationSearch.get() && city) {
      $locationSearch.set(city.label)
    }
  }

  onChange($locationSearch, batch(INPUT_DEBOUNCE)((value: string) => {
    localStorage.setItem('locationSearch', value)
  }))

  onMount($locationSearch, () => {
    if (!$locationSearch.get()) {
      fetchCurrentCity()
    }
  })

  return $locationSearch
}

export function CitySuggestionsStore() {
  const $locationSearch = inject(LocationSearchStore)
  const $citySuggestions = signal<City[]>([])
  const tasks = inject(Tasks)
  const [citySuggestionsTask] = channel(tasks)

  function fetchCitySuggestions(query: string) {
    return citySuggestionsTask(async (signal) => {
      if (query.trim()) {
        $citySuggestions.set(await Cities.fetchCities(query, signal))
      } else {
        $citySuggestions.set([])
      }
    })
  }

  effect($citySuggestions, (get) => {
    fetchCitySuggestions(get($locationSearch))
  }, batch(INPUT_DEBOUNCE))

  return $citySuggestions
}

export function CurrentLocationStore() {
  const $citySuggestions = inject(CitySuggestionsStore)
  const $currentLocation = atIndex($citySuggestions, 0)

  return $currentLocation
}
