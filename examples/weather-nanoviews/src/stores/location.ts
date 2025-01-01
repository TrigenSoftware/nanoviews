import {
  signal,
  lazy,
  onChange,
  atIndex,
  effect,
  onMount,
  batch,
  channel
} from 'nanoviews/store'
import type { City } from '../services/types.js'
import * as Cities from '../services/cities.js'
import * as Location from '../services/location.js'
import { tasks } from './tasks.js'

const INPUT_DEBOUNCE = 300

export const $locationSearch = lazy(
  () => localStorage.getItem('locationSearch') || ''
)

onChange($locationSearch, batch(INPUT_DEBOUNCE)((value: string) => {
  localStorage.setItem('locationSearch', value)
}))

onMount($locationSearch, () => {
  if (!$locationSearch.get()) {
    fetchCurrentCity()
  }
})

export const $citySuggestions = signal<City[]>([])

effect($citySuggestions, (get) => {
  fetchCitySuggestions(get($locationSearch))
}, batch(INPUT_DEBOUNCE))

export const $currentLocation = atIndex($citySuggestions, 0)

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

async function fetchCurrentCity() {
  const city = await Location.fetchCurrentCity()

  if (!$locationSearch.get() && city) {
    $locationSearch.set(city.label)
  }
}
