import { useQuery } from '@tanstack/react-query'
import {
  type Character,
  getCharacter,
  getCharacters
} from 'rickmortyapi'
import {
  OK_STATUS,
  STALE_TIME
} from '#src/common/constants'

export interface Page<T> {
  items: T[]
  totalPages: number
}

export function useCharacters(page: number) {
  return useQuery({
    queryKey: ['characters', page],
    queryFn: async (): Promise<Page<Character>> => {
      if (page === 0) {
        return {
          items: [],
          totalPages: 0
        }
      }

      const response = await getCharacters({
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

export function useCharacter(characterId: number | null) {
  return useQuery({
    queryKey: ['character', characterId],
    queryFn: async (): Promise<Character | null> => {
      if (characterId === null) {
        return null
      }

      const response = await getCharacter(characterId)

      if (response.status === OK_STATUS && response.data) {
        return response.data
      }

      throw new Error(response.statusMessage)
    },
    enabled: characterId !== null,
    staleTime: STALE_TIME
  })
}

export function useResidents(ids: number[]) {
  return useQuery({
    queryKey: ['residents', ids],
    queryFn: async (): Promise<Character[]> => {
      if (ids.length === 0) {
        return []
      }

      const response = await getCharacter(ids)

      if (response.status === OK_STATUS) {
        return Array.isArray(response.data)
          ? response.data
          : [response.data]
      }

      throw new Error(response.statusMessage)
    },
    enabled: ids.length > 0,
    staleTime: STALE_TIME
  })
}
