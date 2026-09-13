import { component$ } from 'nanoviews'
import {
  $locationSearchInputValue,
  $citySuggestions
} from '../stores/location.js'
import { Autocomplete } from './Autocomplete.js'

export const CityInput = component$(() => Autocomplete({
  id: 'city',
  label: 'Search for a city',
  name: 'city',
  $value: $locationSearchInputValue,
  $suggestions: $citySuggestions
}))
