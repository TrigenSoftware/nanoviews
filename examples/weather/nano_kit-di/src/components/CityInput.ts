import {
  inject,
  component$
} from 'nanoviews'
import {
  LocationSearch$,
  CitySuggestions$
} from '../stores/location.js'
import { Autocomplete } from './Autocomplete.js'

export const CityInput = component$(() => {
  const { $searchInputValue } = inject(LocationSearch$)
  const { $suggestions } = inject(CitySuggestions$)

  return Autocomplete({
    id: 'city',
    label: 'Search for a city',
    name: 'city',
    $value: $searchInputValue,
    $suggestions
  })
})
