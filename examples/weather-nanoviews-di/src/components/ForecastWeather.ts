import {
  type ReadableSignal,
  computed,
  record
} from 'nanoviews/store'
import {
  div,
  time,
  img,
  h3,
  p
} from 'nanoviews'
import type { Weather } from '../services/types.js'
import styles from './ForecastWeather.module.css'

export interface Props {
  weather: ReadableSignal<Weather | undefined>
  mode: ReadableSignal<string>
}

export function ForecastWeather({
  weather,
  mode: $mode
}: Props) {
  const $weather = record(weather)
  const $weatherTime = computed(() => {
    const date = $weather.$date()

    if (!date) {
      return ''
    }

    if ($mode() === 'hourly') {
      return date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit'
      })
    }

    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short'
    })
  })

  return div({
    class: styles.root
  })(
    time({
      class: styles.time,
      dateTime: $weather.$dateText
    })(
      $weatherTime
    ),
    img({
      class: styles.image,
      src: $weather.$icon,
      alt: $weather.$description
    }),
    h3({
      class: styles.temp
    })(
      $weather.$tempText
    ),
    p({
      class: styles.description
    })(
      $weather.$description
    )
  )
}
