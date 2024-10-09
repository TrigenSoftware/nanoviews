import {
  atom,
  computed,
  onMount
} from 'nanostores'
import type { City } from '../services/types.js'
import * as Cities from '../services/cities.js'
import * as Location from '../services/location.js'
import { channel } from './channel.js'

function debounce<T extends unknown[]>(fn: (...args: [...T]) => void, ms: number) {
  let timer: ReturnType<typeof setTimeout>

  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

const INPUT_DEBOUNCE = 300

export const $locationSearch = atom('')

onMount($locationSearch, () => {
  const savedQuery = localStorage.getItem('locationSearch')

  if (savedQuery) {
    setTimeout(() => $locationSearch.set(savedQuery))
  } else {
    fetchCurrentCity()
  }

  return $locationSearch.listen(debounce((locationSearch) => {
    localStorage.setItem('locationSearch', locationSearch)
  }, INPUT_DEBOUNCE))
})

export const $citySuggestions = atom([] as City[])

onMount($citySuggestions, () => $locationSearch.subscribe(debounce(fetchCitySuggestions, INPUT_DEBOUNCE)))

export const $currentLocation = computed($citySuggestions, citySuggestions => citySuggestions[0])

const citySuggestionsTask = channel()

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
