import { record } from 'nanoviews/store'
import {
  div,
  label,
  input,
  value$,
  datalist,
  for$,
  option
} from 'nanoviews'
import {
  $locationSearchPaced,
  $citySuggestions
} from '../stores/location.js'
import styles from './CityInput.module.css'

export function CityInput() {
  return div({
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
      [value$]: $locationSearchPaced
    }),
    datalist({
      id: 'cities'
    })(
      for$($citySuggestions)(
        $city => option({
          value: record($city).$label
        })
      )
    )
  )
}
