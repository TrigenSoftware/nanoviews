import {
  app,
  layout,
  page,
  loadable
} from '@kidajs/react-router'
import { $location } from './stores/router'
import { MainLayout } from './ui/pages/MainLayout'

export const App = app($location, [
  layout(MainLayout, [
    page('home', () => <></>),
    page('characters', loadable(() => import('./ui/pages/Characters'))),
    page('character', loadable(() => import('./ui/pages/Character'))),
    page('locations', loadable(() => import('./ui/pages/Locations'))),
    page('location', loadable(() => import('./ui/pages/Location'))),
    page('episodes', loadable(() => import('./ui/pages/Episodes'))),
    page('episode', loadable(() => import('./ui/pages/Episode')))
  ])
])
