import {
  component$,
  main,
  header,
  h1
} from 'nanoviews'
import { CityInput } from './components/CityInput.js'
import { Weather } from './components/Weather.js'
import { Forecast } from './components/Forecast.js'
import styles from './App.module.css'

export const App = component$(() => main({
  class: styles.main
})(
  header()(
    h1({
      class: styles.title
    })(
      'Weather App'
    )
  ),
  CityInput(),
  Weather(),
  Forecast()
))
