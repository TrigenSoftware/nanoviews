import {
  channel,
  effect,
  record,
  list
} from '@nanoviews/stores'
import type {
  City,
  Weather
} from '../services/types.js'
import * as WeatherService from '../services/weather.js'
import { $currentLocation } from './location.js'

export const $currentWeather = record<Weather | null>(null)

effect($currentWeather, $currentLocation, (city) => {
  fetchWeather(city)
})

export const $weatherForecast = list([] as Weather[], record)

effect($weatherForecast, $currentLocation, (city) => {
  fetchWeatherForecast(city)
})

const [weatherTask] = channel()

function fetchWeather(city: City | undefined) {
  return weatherTask(async (signal) => {
    if (city) {
      $currentWeather.set(await WeatherService.fetchWeather(city, signal))
    } else {
      $currentWeather.set(null)
    }
  })
}

const [weatherForecastTask] = channel()

function fetchWeatherForecast(city: City | undefined) {
  return weatherForecastTask(async (signal) => {
    if (city) {
      $weatherForecast.set(await WeatherService.fetchWeatherForecast(city, signal))
    } else {
      $weatherForecast.set([])
    }
  })
}
