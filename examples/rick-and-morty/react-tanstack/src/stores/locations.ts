import { useQuery } from '@tanstack/react-query'
import {
  type Location,
  getLocation,
  getLocations
} from '#src/services/api'
import {
  OK_STATUS,
  STALE_TIME
} from '#src/common/constants'

export interface Page<T> {
  items: T[]
  totalPages: number
}

export function useLocations(page: number) {
  return useQuery({
    queryKey: ['locations', page],
    queryFn: async (): Promise<Page<Location>> => {
      if (page === 0) {
        return {
          items: [],
          totalPages: 0
        }
      }

      const response = await getLocations({
        page
      })

      if (response.status === OK_STATUS && response.data.results && response.data.info) {
        return {
          items: response.data.results,
          totalPages: response.data.info.pages
        }
      }

      throw new Error(response.statusMessage)
    },
    staleTime: STALE_TIME
  })
}

export function useLocation(locationId: number | null) {
  return useQuery({
    queryKey: ['location', locationId],
    queryFn: async (): Promise<Location | null> => {
      if (locationId === null) {
        return null
      }

      const response = await getLocation(locationId)

      if (response.status === OK_STATUS && response.data) {
        return response.data
      }

      throw new Error(response.statusMessage)
    },
    enabled: locationId !== null,
    staleTime: STALE_TIME
  })
}
