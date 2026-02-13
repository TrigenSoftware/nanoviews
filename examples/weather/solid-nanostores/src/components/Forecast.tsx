/* eslint-disable @typescript-eslint/no-magic-numbers */
import { useStore } from '@nanostores/solid'
import {
  createSignal,
  createMemo,
  For,
  Show
} from 'solid-js'
import { $weatherForecast } from '../stores/weather.js'
import { ForecastWeather } from './ForecastWeather.jsx'
import styles from './Forecast.module.css'

export function Forecast() {
  const weatherForecast = useStore($weatherForecast)
  const [mode, setMode] = createSignal<'hourly' | 'daily'>('hourly')
  const forecastToShow = createMemo(() => {
    const weatherForecastValue = weatherForecast()
    const modeValue = mode()

    return weatherForecastValue.filter(
      (_, index) => (modeValue === 'hourly' && index < 10) || (modeValue === 'daily' && index % 8 === 0)
    )
  })

  return (
    <Show when={forecastToShow().length > 0}>
      <section>
        <header class={styles.header}>
          <h2 class={styles.title}>Forecast</h2>
          <select
            class={styles.mode}
            value={mode()}
            onInput={e => setMode(e.currentTarget.value as 'hourly' | 'daily')}
          >
            <option value='hourly'>Hourly</option>
            <option value='daily'>Daily</option>
          </select>
        </header>
        <ul class={styles.list}>
          <For each={forecastToShow()}>
            {weather => (
              <ForecastWeather
                weather={weather}
                mode={mode()}
              />
            )}
          </For>
        </ul>
      </section>
    </Show>
  )
}
