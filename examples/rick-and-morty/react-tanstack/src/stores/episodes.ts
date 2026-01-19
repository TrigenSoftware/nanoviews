import { useQuery } from '@tanstack/react-query'
import {
  type Episode,
  getEpisode,
  getEpisodes,
  getCharacter
} from 'rickmortyapi'
import {
  OK_STATUS,
  STALE_TIME
} from '#src/common/constants'

export interface Page<T> {
  items: T[]
  totalPages: number
}

export function useEpisodes(page: number) {
  return useQuery({
    queryKey: ['episodes', page],
    queryFn: async (): Promise<Page<Episode>> => {
      if (page === 0) {
        return {
          items: [],
          totalPages: 0
        }
      }

      const response = await getEpisodes({
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

export function useEpisode(episodeId: number | null) {
  return useQuery({
    queryKey: ['episode', episodeId],
    queryFn: async (): Promise<Episode | null> => {
      if (episodeId === null) {
        return null
      }

      const response = await getEpisode(episodeId)

      if (response.status === OK_STATUS && response.data) {
        return response.data
      }

      throw new Error(response.statusMessage)
    },
    enabled: episodeId !== null,
    staleTime: STALE_TIME
  })
}

export function useCharacterEpisodes(characterId: number | null) {
  return useQuery({
    queryKey: ['characterEpisodes', characterId],
    queryFn: async (): Promise<Episode[]> => {
      if (characterId === null) {
        return []
      }

      // First get the character to get episode URLs
      const characterResponse = await getCharacter(characterId)

      if (characterResponse.status !== OK_STATUS || !characterResponse.data) {
        throw new Error(characterResponse.statusMessage || 'Failed to fetch character')
      }

      const character = characterResponse.data
      const episodeUrls = character.episode

      if (episodeUrls.length === 0) {
        return []
      }

      const ids = episodeUrls.map((url: string) => {
        const parts = url.split('/')

        return Number(parts[parts.length - 1])
      })
      const response = await getEpisode(ids)

      if (response.status === OK_STATUS) {
        return Array.isArray(response.data)
          ? response.data
          : [response.data]
      }

      throw new Error(response.statusMessage)
    },
    enabled: characterId !== null,
    staleTime: STALE_TIME
  })
}
