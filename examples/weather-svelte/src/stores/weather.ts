import {
  onMount,
  atom
} from 'nanostores'
import type {
  City,
  Weather
} from '../services/types.js'
import * as WeatherService from '../services/weather.js'
import { $currentLocation } from './location.js'
import { channel } from './channel.js'

export const $currentWeather = atom<Weather | null>(null)

onMount($currentWeather, () => $currentLocation.subscribe((fetchWeather)))

export const $weatherForecast = atom([] as Weather[])

onMount($weatherForecast, () => $currentLocation.subscribe((fetchWeatherForecast)))

const weatherTask = channel()

function fetchWeather(city: City | undefined) {
  return weatherTask(async (signal) => {
    if (city) {
      $currentWeather.set(await WeatherService.fetchWeather(city, signal))
    } else {
      $currentWeather.set(null)
    }
  })
}

const weatherForecastTask = channel()

function fetchWeatherForecast(city: City | undefined) {
  return weatherForecastTask(async (signal) => {
    if (city) {
      $weatherForecast.set(await WeatherService.fetchWeatherForecast(city, signal))
    } else {
      $weatherForecast.set([])
    }
  })
}
