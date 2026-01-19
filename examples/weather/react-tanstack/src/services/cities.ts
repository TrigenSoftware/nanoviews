import type {
  City,
  Coords
} from './types.js'

function cityToString(city: City) {
  return `${city.name}, ${city.country}`
}

export async function fetchCities(query: string, signal?: AbortSignal) {
  if (!query.trim()) {
    return []
  }

  const params = new URLSearchParams({
    q: query,
    limit: '5',
    appid: import.meta.env.VITE_WEATHER_API_KEY
  })
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?${params}`, {
    signal
  })
  const responseCities: City[] = await response.json()
  const citiesLables = new Set<string>()
  const uniqueCities: City[] = []

  responseCities.forEach((city) => {
    const label = cityToString(city)

    if (!citiesLables.has(label)) {
      city.label = label

      citiesLables.add(label)
      uniqueCities.push(city)
    }
  })

  return uniqueCities
}

export async function fetchCityByLocation(coords: Coords, signal?: AbortSignal) {
  const params = new URLSearchParams({
    lat: coords.latitude.toString(),
    lon: coords.longitude.toString(),
    limit: '1',
    appid: import.meta.env.VITE_WEATHER_API_KEY
  })
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?${params}`, {
    signal
  })
  const city: City = (await response.json())[0] || null

  if (city) {
    city.label = cityToString(city)
  }

  return city
}
