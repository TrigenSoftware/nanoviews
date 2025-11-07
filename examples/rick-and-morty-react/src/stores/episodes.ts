import {
  signal,
  onMountEffect,
  mountable
} from 'kida'
import {
  type Episode,
  getEpisode,
  getEpisodes
} from 'rickmortyapi'
import { OK_STATUS } from '../common/constants'
import {
  task,
  $error
} from './tasks'
import {
  $characterId,
  $episodeId,
  $page
} from './router'
import { $character } from './characters'

export const $episodes = mountable(signal<Episode[]>([]))

export const $episodesTotalPages = signal(0)

onMountEffect($episodes, () => {
  fetchEpisodes($page())
})

export function fetchEpisodes(page = 1) {
  return task(async () => {
    const response = await getEpisodes({
      page
    })

    if (response.status === OK_STATUS && response.data.results && response.data.info) {
      $episodes(response.data.results)
      $episodesTotalPages(response.data.info.pages)
    } else {
      $episodes([])
      $episodesTotalPages(0)
      $error(response.statusMessage)
    }
  })
}

export const $episode = mountable(signal<Episode | null>(null))

onMountEffect($episode, () => {
  const id = $episodeId()

  if (id) {
    fetchEpisode(id)
  }
})

export function fetchEpisode(id: number) {
  return task(async () => {
    const response = await getEpisode(id)

    if (response.status === OK_STATUS && response.data) {
      $episode(response.data)
    } else {
      $episode(null)
      $error(response.statusMessage)
    }
  })
}

export const $characterEpisodes = mountable(signal<Episode[]>([]))

onMountEffect($characterEpisodes, () => {
  const characterId = $characterId()

  if (characterId) {
    fetchCharacterEpisodes($character()?.episode)
  }
})

export function fetchCharacterEpisodes(episodes: string[] | undefined) {
  return task(async () => {
    const ids = episodes?.map((ep) => {
      const parts = ep.split('/')

      return Number(parts[parts.length - 1])
    }) || []

    if (ids.length) {
      const response = await getEpisode(ids)

      if (response.status === OK_STATUS) {
        $characterEpisodes(
          Array.isArray(response.data)
            ? response.data
            : [response.data]
        )
      } else {
        $characterEpisodes([])
        $error(response.statusMessage)
      }
    } else {
      $characterEpisodes([])
    }
  })
}

