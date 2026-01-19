import type {
  City,
  Weather
} from './types.js'

const KELVIN_CELSIUS_DIFF = 273.15

function toCelsius(kelvin: number) {
  return Math.round(kelvin - KELVIN_CELSIUS_DIFF)
}

function toSentenceCase(text: string) {
  return text[0].toUpperCase() + text.slice(1)
}

function toTempText(value: number): string {
  return `${value > 0 ? '+' : ''}${value}°`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toWeather(data: any) {
  const temp = toCelsius(data.main.temp)
  const feelsLike = toCelsius(data.main.feels_like)

  return {
    date: new Date(data.dt_txt),
    dateText: data.dt_txt,
    temp,
    tempText: toTempText(temp),
    feelsLike,
    feelsLikeText: toTempText(feelsLike),
    humidity: data.main.humidity,
    description: toSentenceCase(data.weather[0].description || ''),
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  }
}

export async function fetchWeather(city: City, signal?: AbortSignal): Promise<Weather> {
  const params = new URLSearchParams({
    lat: city.lat.toString(),
    lon: city.lon.toString(),
    appid: import.meta.env.VITE_WEATHER_API_KEY
  })
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${params}`, {
    signal
  })
  const data = await response.json()

  return toWeather(data)
}

export async function fetchWeatherForecast(city: City, signal?: AbortSignal): Promise<Weather[]> {
  const params = new URLSearchParams({
    lat: city.lat.toString(),
    lon: city.lon.toString(),
    appid: import.meta.env.VITE_WEATHER_API_KEY
  })
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${params}`, {
    signal
  })
  const { list } = await response.json()
  const forecast = list.map(toWeather)

  return forecast
}
