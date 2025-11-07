import {
  signal,
  paced,
  debounce,
  external,
  atIndex,
  onMountEffect,
  onMount,
  channel,
  untracked,
  mountable
} from 'nanoviews/store'
import type { City } from '../services/types.js'
import * as Cities from '../services/cities.js'
import * as Location from '../services/location.js'
import { tasks } from './tasks.js'

const INPUT_DEBOUNCE = 300

export const $locationSearch = mountable(external<string>(($locationSearch) => {
  $locationSearch(localStorage.getItem('locationSearch') || '')

  return (nextValue) => {
    $locationSearch(nextValue)
    localStorage.setItem('locationSearch', untracked($locationSearch))
  }
}))

export const $locationSearchPaced = paced($locationSearch, debounce(INPUT_DEBOUNCE))

onMount($locationSearch, () => {
  if (!$locationSearch()) {
    fetchCurrentCity()
  }
})

export const $citySuggestions = mountable(signal<City[]>([]))

onMountEffect($citySuggestions, () => {
  fetchCitySuggestions($locationSearch())
})

export const $currentLocation = atIndex($citySuggestions, 0)

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

async function fetchCurrentCity() {
  const city = await Location.fetchCurrentCity()

  if (!$locationSearch() && city) {
    $locationSearch(city.label)
  }
}
