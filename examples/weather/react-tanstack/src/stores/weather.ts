import { useQuery } from '@tanstack/react-query'
import type { City } from '../services/types.js'
import {
  fetchWeather,
  fetchWeatherForecast
} from '../services/weather.js'
import { STALE_TIME } from './constants.js'

export function useCurrentWeather(city: City | null) {
  return useQuery({
    queryKey: ['currentWeather', city?.lat, city?.lon],
    queryFn: () => fetchWeather(city!),
    enabled: Boolean(city),
    staleTime: STALE_TIME
  })
}

export function useWeatherForecast(city: City | null) {
  return useQuery({
    queryKey: ['weatherForecast', city?.lat, city?.lon],
    queryFn: () => fetchWeatherForecast(city!),
    enabled: Boolean(city),
    staleTime: STALE_TIME
  })
}
