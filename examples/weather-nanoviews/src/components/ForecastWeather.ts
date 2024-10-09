import type {
  Store,
  RecordStore
} from '@nanoviews/stores'
import {
  component$,
  div,
  time,
  img,
  h3,
  p
} from 'nanoviews'
import { computed } from '@nanoviews/stores'
import type { Weather } from '../services/types.js'
import styles from './ForecastWeather.module.css'

export interface Props {
  weather: RecordStore<Weather | undefined>
  mode: Store<'daily' | 'hourly'>
}

export const ForecastWeather = component$((props: Props) => {
  const {
    weather: $weather,
    mode: $mode
  } = props
  const $weatherTime = computed([$weather.date, $mode], (date, mode) => {
    if (!date) {
      return ''
    }

    if (mode === 'hourly') {
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
      dateTime: $weather.dateText
    })(
      $weatherTime
    ),
    img({
      class: styles.image,
      src: $weather.icon,
      alt: $weather.description
    }),
    h3({
      class: styles.temp
    })(
      $weather.tempText
    ),
    p({
      class: styles.description
    })(
      $weather.description
    )
  )
})
