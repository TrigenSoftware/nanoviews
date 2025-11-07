import {
  signal,
  onMountEffect,
  mountable
} from 'kida'
import {
  type Character,
  getCharacter,
  getCharacters
} from 'rickmortyapi'
import { OK_STATUS } from '../common/constants'
import {
  task,
  $error
} from './tasks'
import {
  $characterId,
  $episodeId,
  $locationId,
  $page
} from './router'
import { $location } from './locations'
import { $episode } from './episodes'

export const $characters = mountable(signal<Character[]>([]))

export const $charactersTotalPages = signal(0)

onMountEffect($characters, () => {
  fetchCharacters($page())
})

export function fetchCharacters(page = 1) {
  return task(async () => {
    const response = await getCharacters({
      page
    })

    if (response.status === OK_STATUS && response.data.results && response.data.info) {
      $characters(response.data.results)
      $charactersTotalPages(response.data.info.pages)
    } else {
      $characters([])
      $charactersTotalPages(0)
      $error(response.statusMessage)
    }
  })
}

export const $character = mountable(signal<Character | null>(null))

onMountEffect($character, () => {
  const id = $characterId()

  if (id) {
    fetchCharacter(id)
  }
})

export function fetchCharacter(id: number) {
  return task(async () => {
    const response = await getCharacter(id)

    if (response.status === OK_STATUS && response.data) {
      $character(response.data)
    } else {
      $character(null)
      $error(response.statusMessage)
    }
  })
}

export const $residents = mountable(signal<Character[]>([]))

onMountEffect($residents, () => {
  const locationId = $locationId()
  const episodeId = $episodeId()

  if (locationId) {
    fetchCharactersByRefs($location()?.residents)
  } else
    if (episodeId) {
      fetchCharactersByRefs($episode()?.characters)
    }
})

export function fetchCharactersByRefs(refs: string[] | undefined) {
  return task(async () => {
    const ids = refs?.map((ref) => {
      const parts = ref.split('/')

      return Number(parts[parts.length - 1])
    }) || []

    if (ids.length) {
      const response = await getCharacter(ids)

      if (response.status === OK_STATUS) {
        $residents(
          Array.isArray(response.data)
            ? response.data
            : [response.data]
        )
      } else {
        $residents([])
        $error(response.statusMessage)
      }
    } else {
      $residents([])
    }
  })
}
