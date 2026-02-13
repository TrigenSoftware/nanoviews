import type {
  City,
  Coords
} from './types'

function cityToString(city: City) {
  return `${city.name}, ${city.country}`
}

interface RawCity {
  name: string
  country?: string
  // eslint-disable-next-line @typescript-eslint/naming-convention
  country_code?: string
  latitude: number
  longitude: number
}

function toCity(rawCity: RawCity): City {
  const city: City = {
    name: rawCity.name,
    country: rawCity.country_code?.toUpperCase() || rawCity.country || '',
    lat: rawCity.latitude,
    lon: rawCity.longitude,
    label: ''
  }
  const label = cityToString(city)

  city.label = label

  return city
}

export async function fetchCities(query: string, signal?: AbortSignal) {
  if (!query.trim()) {
    return []
  }

  const params = new URLSearchParams({
    name: query.split(',')[0].trim(),
    count: '5',
    language: 'en',
    format: 'json'
  })
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
    signal
  })
  const responseCities: RawCity[] = (await response.json()).results || []
  const citiesLables = new Set<string>()
  const uniqueCities: City[] = []

  responseCities.forEach((rawCity) => {
    const city = toCity(rawCity)

    if (!citiesLables.has(city.label)) {
      citiesLables.add(city.label)
      uniqueCities.push(city)
    }
  })

  return uniqueCities
}

export async function fetchCityByLocation(coords: Coords, signal?: AbortSignal) {
  const params = new URLSearchParams({
    latitude: coords.latitude.toString(),
    longitude: coords.longitude.toString(),
    count: '1',
    language: 'en',
    format: 'json'
  })
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
    signal
  })
  const rawCity: RawCity = (await response.json())?.results?.[0] || null

  if (rawCity) {
    return toCity(rawCity)
  }

  return null
}
