import {
  Switch,
  Match,
  splitProps
} from 'solid-js'
import type { Weather } from 'data-layer/services/types'
import styles from './ForecastWeather.module.css'

interface Props {
  weather: Readonly<Weather>
  mode: 'hourly' | 'daily'
}

export function ForecastWeather(props: Props) {
  const [local] = splitProps(props, ['weather', 'mode'])

  return (
    <div class={styles.root}>
      <time
        class={styles.time}
        dateTime={local.weather.dateText}
      >
        <Switch>
          <Match when={local.mode === 'hourly'}>
            {local.weather.date.toLocaleTimeString(undefined, {
              hour: 'numeric',
              minute: '2-digit'
            })}
          </Match>
          <Match when={local.mode === 'daily'}>
            {local.weather.date.toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short'
            })}
          </Match>
        </Switch>
      </time>
      <img
        class={styles.image}
        src={local.weather.icon}
        alt={local.weather.description}
      />
      <h3
        class={styles.temp}
      >
        {local.weather.tempText}
      </h3>
      <p class={styles.description}>
        {local.weather.description}
      </p>
    </div>
  )
}
