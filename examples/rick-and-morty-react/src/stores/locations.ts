import {
  signal,
  onMountEffect,
  mountable
} from 'kida'
import {
  type Location,
  getLocation,
  getLocations
} from 'rickmortyapi'
import { OK_STATUS } from '../common/constants'
import {
  task,
  $error
} from './tasks'
import {
  $locationId,
  $page
} from './router'

export const $locations = mountable(signal<Location[]>([]))

export const $locationsTotalPages = signal(0)

onMountEffect($locations, () => {
  fetchLocations($page())
})

export function fetchLocations(page = 1) {
  return task(async () => {
    const response = await getLocations({
      page
    })

    if (response.status === OK_STATUS && response.data.results && response.data.info) {
      $locations(response.data.results)
      $locationsTotalPages(response.data.info.pages)
    } else {
      $locations([])
      $locationsTotalPages(0)
      $error(response.statusMessage)
    }
  })
}

export const $location = mountable(signal<Location | null>(null))

onMountEffect($location, () => {
  const id = $locationId()

  if (id) {
    fetchLocation(id)
  }
})

export function fetchLocation(id: number) {
  return task(async () => {
    const response = await getLocation(id)

    if (response.status === OK_STATUS && response.data) {
      $location(response.data)
    } else {
      $location(null)
      $error(response.statusMessage)
    }
  })
}
