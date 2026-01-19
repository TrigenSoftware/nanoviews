import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { MainLayout } from '#src/ui/pages/MainLayout'

const rootRoute = createRootRoute({
  component: MainLayout
})
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/'
}).lazy(() => import('../routes').then(d => d.Route))
const charactersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/characters',
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1
  })
}).lazy(() => import('../routes/characters').then(d => d.Route))
const characterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/character/$characterId',
  parseParams: params => ({
    characterId: Number(params.characterId)
  })
}).lazy(() => import('../routes/character').then(d => d.Route))
const locationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/locations',
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1
  })
}).lazy(() => import('../routes/locations').then(d => d.Route))
const locationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/location/$locationId',
  parseParams: params => ({
    locationId: Number(params.locationId)
  })
}).lazy(() => import('../routes/location').then(d => d.Route))
const episodesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/episodes',
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 1
  })
}).lazy(() => import('../routes/episodes').then(d => d.Route))
const episodeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/episode/$episodeId',
  parseParams: params => ({
    episodeId: Number(params.episodeId)
  })
}).lazy(() => import('../routes/episode').then(d => d.Route))
const routeTree = rootRoute.addChildren([
  indexRoute,
  charactersRoute,
  characterRoute,
  locationsRoute,
  locationRoute,
  episodesRoute,
  episodeRoute
])

export const router = createRouter({
  routeTree
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
