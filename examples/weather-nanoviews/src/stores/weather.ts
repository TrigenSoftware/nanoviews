import {
  channel,
  effect,
  record,
  signal
} from 'nanoviews/store'
import type {
  City,
  Weather
} from '../services/types.js'
import * as WeatherService from '../services/weather.js'
import { tasks } from './tasks.js'
import { $currentLocation } from './location.js'

export const $currentWeather = record(signal<Weather | null>(null))

effect($currentWeather, (get) => {
  fetchWeather(get($currentLocation))
})

export const $weatherForecast = signal<Weather[]>([])

effect($weatherForecast, (get) => {
  fetchWeatherForecast(get($currentLocation))
})

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
