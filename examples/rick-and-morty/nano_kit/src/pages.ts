import {
  layout,
  page,
  loadable
} from '@nanoviews/router'
import { Spinner } from './ui/components/Spinner'
import { MainLayout } from './ui/pages/MainLayout'
import HomePage from './ui/pages/Home'

export const pages = [
  layout(MainLayout, [
    page('home', HomePage),
    page(
      'characters',
      loadable(
        () => import('./ui/pages/Characters'),
        () => Spinner()(
          'Loading characters page...'
        )
      )
    ),
    page(
      'character',
      loadable(
        () => import('./ui/pages/Character'),
        () => Spinner()(
          'Loading character page...'
        )
      )
    ),
    page(
      'locations',
      loadable(
        () => import('./ui/pages/Locations'),
        () => Spinner()(
          'Loading locations page...'
        )
      )
    ),
    page(
      'location',
      loadable(
        () => import('./ui/pages/Location'),
        () => Spinner()(
          'Loading location page...'
        )
      )
    ),
    page(
      'episodes',
      loadable(
        () => import('./ui/pages/Episodes'),
        () => Spinner()(
          'Loading episodes page...'
        )
      )
    ),
    page(
      'episode',
      loadable(
        () => import('./ui/pages/Episode'),
        () => Spinner()(
          'Loading episode page...'
        )
      )
    )
  ])
]
