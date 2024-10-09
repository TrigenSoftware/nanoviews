/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  atom,
  computed,
  list,
  record,
  length$
} from '@nanoviews/stores'
import {
  component$,
  section,
  header,
  h2,
  select,
  option,
  selected$,
  ul,
  for$,
  if$
} from 'nanoviews'
import { $weatherForecast } from '../stores/weather.js'
import { ForecastWeather } from './ForecastWeather.js'
import styles from './Forecast.module.css'

export const Forecast = component$(() => {
  const $mode = atom<'daily' | 'hourly'>('hourly')
  const $forecastToShow = list(computed(
    [$weatherForecast, $mode],
    (forecast, mode) => forecast.filter(
      (_, index) => (mode === 'hourly' && index < 10) || (mode === 'daily' && index % 8 === 0)
    )
  ), record)

  return if$(length$($weatherForecast))(
    () => section()(
      header({
        class: styles.header
      })(
        h2({
          class: styles.title
        })(
          'Forecast'
        ),
        select({
          class: styles.mode,
          [selected$]: $mode
        })(
          option({
            value: 'hourly'
          })(
            'Hourly'
          ),
          option({
            value: 'daily'
          })(
            'Daily'
          )
        )
      ),
      ul({
        class: styles.list
      })(
        for$($forecastToShow)(
          $weather => ForecastWeather({
            weather: $weather,
            mode: $mode
          })
        )
      )
    )
  )
})
