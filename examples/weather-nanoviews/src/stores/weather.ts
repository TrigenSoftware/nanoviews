import {
  channel,
  onMountEffect,
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

onMountEffect($currentWeather, () => {
  fetchWeather($currentLocation())
})

export const $weatherForecast = signal<Weather[]>([])

onMountEffect($weatherForecast, () => {
  fetchWeatherForecast($currentLocation())
})

const [weatherTask] = channel(tasks)

function fetchWeather(city: City | undefined) {
  return weatherTask(async (signal) => {
    if (city) {
      $currentWeather(await WeatherService.fetchWeather(city, signal))
    } else {
      $currentWeather(null)
    }
  })
}

const [weatherForecastTask] = channel(tasks)

function fetchWeatherForecast(city: City | undefined) {
  return weatherForecastTask(async (signal) => {
    if (city) {
      $weatherForecast(await WeatherService.fetchWeatherForecast(city, signal))
    } else {
      $weatherForecast([])
    }
  })
}
