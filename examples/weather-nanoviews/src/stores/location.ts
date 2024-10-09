import {
  atom,
  list,
  record,
  effect,
  onMount,
  batch,
  channel
} from '@nanoviews/stores'
import type { City } from '../services/types.js'
import * as Cities from '../services/cities.js'
import * as Location from '../services/location.js'

const INPUT_DEBOUNCE = 300

export const $locationSearch = atom('')

onMount($locationSearch, () => {
  const savedQuery = localStorage.getItem('locationSearch')

  if (savedQuery) {
    $locationSearch.set(savedQuery)
  } else {
    fetchCurrentCity()
  }
})

effect($locationSearch, $locationSearch, (locationSearch) => {
  localStorage.setItem('locationSearch', locationSearch)
}, batch(INPUT_DEBOUNCE))

export const $citySuggestions = list([] as City[], record)

effect($citySuggestions, $locationSearch, (locationSearch) => {
  fetchCitySuggestions(locationSearch)
}, batch(INPUT_DEBOUNCE))

export const $currentLocation = $citySuggestions.at(0)

const [citySuggestionsTask] = channel()

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
