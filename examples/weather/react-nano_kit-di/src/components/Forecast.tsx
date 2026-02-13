/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  useState,
  useMemo,
  useCallback
} from 'react'
import {
  useInject,
  useSignal
} from '@nano_kit/react'
import { WeatherForecast$ } from '../stores/weather.js'
import { ForecastWeather } from './ForecastWeather.jsx'
import styles from './Forecast.module.css'

export function Forecast() {
  const { $forecast } = useInject(WeatherForecast$)
  const forecast = useSignal($forecast)
  const [mode, setMode] = useState('hourly')
  const forecastToShow = useMemo(
    () => forecast.filter(
      (_, index) => (mode === 'hourly' && index < 10) || (mode === 'daily' && index % 8 === 0)
    ),
    [forecast, mode]
  )
  const handleModeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => setMode(e.target.value),
    []
  )

  if (forecast.length === 0) {
    return null
  }

  return (
    <section>
      <header className={styles.header}>
        <h2 className={styles.title}>
          Forecast
        </h2>
        <select
          className={styles.mode}
          value={mode}
          onChange={handleModeChange}
        >
          <option value='hourly'>
            Hourly
          </option>
          <option value='daily'>
            Daily
          </option>
        </select>
      </header>
      <ul className={styles.list}>
        {forecastToShow.map(weather => (
          <ForecastWeather
            key={weather.dateText}
            weather={weather}
            mode={mode}
          />
        ))}
      </ul>
    </section>
  )
}
