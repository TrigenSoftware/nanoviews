import {
  if_,
  div,
  h3,
  img,
  p,
  br,
  inject
} from 'nanoviews'
import { CurrentWeather$ } from 'data-layer/stores/weather'
import styles from './Weather.module.css'

export function Weather() {
  const { $weather } = inject(CurrentWeather$)

  return if_($weather)(
    () => div({
      class: styles.root
    })(
      h3({
        class: styles.currentTemp
      })(
        $weather.$tempText
      ),
      img({
        class: styles.image,
        src: $weather.$icon,
        alt: $weather.$description
      }),
      p({
        class: styles.feelsLike
      })(
        'Feels like ', $weather.$feelsLikeText
      ),
      p({
        class: styles.description
      })(
        $weather.$description,
        br(),
        'Humidity: ',
        $weather.$humidity,
        '%'
      )
    )
  )
}
