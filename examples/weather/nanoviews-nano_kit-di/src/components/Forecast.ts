/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  signal,
  computed,
  length
} from 'nanoviews/store'
import {
  section,
  header,
  h2,
  select,
  option,
  ul,
  $$selected,
  for_,
  if_,
  trackBy,
  inject
} from 'nanoviews'
import { WeatherForecast$ } from '../stores/weather.js'
import { ForecastWeather } from './ForecastWeather.js'
import styles from './Forecast.module.css'

export function Forecast() {
  const { $forecast } = inject(WeatherForecast$)
  const $mode = signal('hourly')
  const $forecastToShow = computed(() => {
    const forecast = $forecast()
    const mode = $mode()

    return forecast.filter(
      (_, index) => (mode === 'hourly' && index < 10) || (mode === 'daily' && index % 8 === 0)
    )
  })

  return if_(length($forecastToShow))(
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
          [$$selected]: $mode
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
        for_($forecastToShow, trackBy('dateText'))(
          $weather => ForecastWeather({
            weather: $weather,
            mode: $mode
          })
        )
      )
    )
  )
}
