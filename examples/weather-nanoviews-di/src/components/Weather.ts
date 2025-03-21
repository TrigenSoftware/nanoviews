import {
  if$,
  div,
  h3,
  img,
  p,
  br,
  inject
} from 'nanoviews'
import { CurrentWeatherStore } from '../stores/weather.js'
import styles from './Weather.module.css'

export function Weather() {
  const $currentWeather = inject(CurrentWeatherStore)

  return if$($currentWeather)(
    () => div({
      class: styles.root
    })(
      h3({
        class: styles.currentTemp
      })(
        $currentWeather.$tempText
      ),
      img({
        class: styles.image,
        src: $currentWeather.$icon,
        alt: $currentWeather.$description
      }),
      p({
        class: styles.feelsLike
      })(
        'Feels like ', $currentWeather.$feelsLikeText
      ),
      p({
        class: styles.description
      })(
        $currentWeather.$description,
        br(),
        'Humidity: ',
        $currentWeather.$humidity,
        '%'
      )
    )
  )
}
