import { inject } from '@nano_kit/store'
import {
  Location$,
  routeParam,
  searchParam,
  searchParams
} from '@nano_kit/router'

export const routes = {
  home: '/',
  characters: '/characters',
  character: '/character/:characterId',
  locations: '/locations',
  location: '/location/:locationId',
  episodes: '/episodes',
  episode: '/episode/:episodeId'
} as const

export function Params$() {
  const $location = inject(Location$)
  const $searchParams = searchParams($location)
  const $page = searchParam($searchParams, 'page', v => (v ? Number(v) : 1))
  const $characterId = routeParam($location, 'characterId', v => (v ? Number(v) : null))
  const $locationId = routeParam($location, 'locationId', v => (v ? Number(v) : null))
  const $episodeId = routeParam($location, 'episodeId', v => (v ? Number(v) : null))

  return {
    $page,
    $characterId,
    $locationId,
    $episodeId
  }
}
