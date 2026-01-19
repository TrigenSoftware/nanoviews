
import { onMount } from '@nano_kit/store'
import {
  browserNavigation,
  buildPaths,
  listenLinks,
  routeParam,
  searchParam,
  searchParams
} from '@nano_kit/router'

const routes = {
  home: '/',
  characters: '/characters',
  character: '/character/:characterId',
  locations: '/locations',
  location: '/location/:locationId',
  episodes: '/episodes',
  episode: '/episode/:episodeId'
} as const

export const [$location, navigation] = browserNavigation(routes)

onMount($location, () => listenLinks(navigation))

export const $searchParams = searchParams($location)

export const $page = searchParam($searchParams, 'page', v => (v ? Number(v) : 1))

export const $characterId = routeParam($location, 'characterId', v => (v ? Number(v) : null))

export const $locationId = routeParam($location, 'locationId', v => (v ? Number(v) : null))

export const $episodeId = routeParam($location, 'episodeId', v => (v ? Number(v) : null))

export const paths = buildPaths(routes)
