import { previous } from '@nano_kit/store'
import {
  browserNavigation,
  buildPaths,
  routeParam
} from '@nano_kit/router'

export const routes = {
  home: '/',
  newApplication: '/application/new',
  application: '/application/:applicationId'
} as const

export const paths = buildPaths(routes)

export const [$location, navigation] = browserNavigation(routes)

export const $prevRoute = previous($location.$route)

export const $applicationId = routeParam($location, 'applicationId')
