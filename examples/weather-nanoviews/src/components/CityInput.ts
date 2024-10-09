import {
  component$,
  div,
  label,
  input,
  value$,
  datalist,
  for$,
  option
} from 'nanoviews'
import {
  $locationSearch,
  $citySuggestions
} from '../stores/location.js'
import styles from './CityInput.module.css'

export const CityInput = component$(() => div({
  class: styles.root
})(
  label({
    for: 'city',
    class: styles.label
  })(
    'Search for a city:'
  ),
  input({
    class: styles.input,
    id: 'city',
    type: 'text',
    list: 'cities',
    name: 'city',
    [value$]: $locationSearch
  }),
  datalist({
    id: 'cities'
  })(
    for$($citySuggestions)(
      $city => option({
        value: $city.label
      })
    )
  )
))
