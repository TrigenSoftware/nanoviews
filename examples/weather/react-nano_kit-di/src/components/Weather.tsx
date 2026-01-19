import {
  useInject,
  useSignal
} from '@nano_kit/react'
import { CurrentWeather$ } from 'data-layer/stores/weather'
import styles from './Weather.module.css'

export function Weather() {
  const { $weather } = useInject(CurrentWeather$)
  const weather = useSignal($weather)

  if (!weather) {
    return null
  }

  return (
    <div className={styles.root}>
      <h3 className={styles.currentTemp}>
        {weather.tempText}
      </h3>
      <img
        className={styles.image}
        src={weather.icon}
        alt={weather.description}
      />
      <p className={styles.feelsLike}>
        Feels like
        {' '}
        {weather.feelsLikeText}
      </p>
      <p className={styles.description}>
        {weather.description}
        <br/>
        Humidity:
        {' '}
        {weather.humidity}
        %
      </p>
    </div>
  )
}
