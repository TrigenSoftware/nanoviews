import { useStore } from '@nanostores/solid'
import { Show } from 'solid-js'
import { $currentWeather } from '../stores/weather.js'
import styles from './Weather.module.css'

export function Weather() {
  const currentWeather = useStore($currentWeather)

  return (
    <Show when={currentWeather()}>
      <div class={styles.root}>
        <h3 class={styles.currentTemp}>
          {currentWeather()!.tempText}
        </h3>
        <img
          class={styles.image}
          src={currentWeather()!.icon}
          alt={currentWeather()!.description}
        />
        <p
          class={styles.feelsLike}
        >
          Feels like {currentWeather()!.feelsLikeText}
        </p>
        <p class={styles.description}>
          {currentWeather()!.description}
          <br />
          Humidity: {currentWeather()!.humidity}%
        </p>
      </div>
    </Show>
  )
}
