import {
  useState,
  useEffect
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCities } from '../services/cities.js'
import { fetchCurrentCity } from '../services/location.js'
import { STALE_TIME } from './constants.js'

const INPUT_DEBOUNCE = 300

export function useCitySuggestions(search: string) {
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), INPUT_DEBOUNCE)

    return () => clearTimeout(timer)
  }, [search])

  return useQuery({
    queryKey: ['citySuggestions', debouncedSearch],
    queryFn: () => fetchCities(debouncedSearch),
    enabled: debouncedSearch.trim().length > 0,
    staleTime: STALE_TIME
  })
}

export function useCurrentCity() {
  return useQuery({
    queryKey: ['currentCity'],
    queryFn: () => fetchCurrentCity(),
    staleTime: STALE_TIME
  })
}
