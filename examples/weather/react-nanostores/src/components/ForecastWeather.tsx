import type { Weather } from 'data-layer/services/types'
import styles from './ForecastWeather.module.css'

interface Props {
  weather: Readonly<Weather>
  mode: string
}

export function ForecastWeather({ weather, mode }: Props) {
  return (
    <div className={styles.root}>
      <time
        className={styles.time}
        dateTime={weather.dateText}
      >
        {mode === 'hourly'
          ? weather.date.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit'
          })
          : weather.date.toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short'
          })}
      </time>
      <img
        className={styles.image}
        src={weather.icon}
        alt={weather.description}
      />
      <h3
        className={styles.temp}
      >
        {weather.tempText}
      </h3>
      <p className={styles.description}>
        {weather.description}
      </p>
    </div>
  )
}
