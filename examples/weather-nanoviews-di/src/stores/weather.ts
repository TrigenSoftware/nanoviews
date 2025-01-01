import {
  channel,
  effect,
  record,
  signal,
  Tasks,
  inject
} from 'nanoviews/store'
import type {
  City,
  Weather
} from '../services/types.js'
import * as WeatherService from '../services/weather.js'
import { CurrentLocationStore } from './location.js'

export function CurrentWeatherStore() {
  const $currentLocation = inject(CurrentLocationStore)
  const $currentWeather = record(signal<Weather | null>(null))
  const tasks = inject(Tasks)
  const [weatherTask] = channel(tasks)

  function fetchWeather(city: City | undefined) {
    return weatherTask(async (signal) => {
      if (city) {
        $currentWeather.set(await WeatherService.fetchWeather(city, signal))
      } else {
        $currentWeather.set(null)
      }
    })
  }

  effect($currentWeather, (get) => {
    fetchWeather(get($currentLocation))
  })

  return $currentWeather
}

export function WeatherForecastStore() {
  const $currentLocation = inject(CurrentLocationStore)
  const $weatherForecast = signal<Weather[]>([])
  const tasks = inject(Tasks)
  const [weatherForecastTask] = channel(tasks)

  function fetchWeatherForecast(city: City | undefined) {
    return weatherForecastTask(async (signal) => {
      if (city) {
        $weatherForecast.set(await WeatherService.fetchWeatherForecast(city, signal))
      } else {
        $weatherForecast.set([])
      }
    })
  }

  effect($weatherForecast, (get) => {
    fetchWeatherForecast(get($currentLocation))
  })

  return $weatherForecast
}
