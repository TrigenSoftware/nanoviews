import {
  component$,
  effect$
} from 'nanoviews'
import {
  page,
  layout,
  resetScroll,
  listenNavigationLinks$,
  router,
  pageView
} from '@nanoviews/router'
import {
  $location,
  navigation
} from './stores/router'
import { Layout } from './pages/Layout'
import { Home } from './pages/Home'
import { Application } from './pages/Application'

const $page = router($location, [
  layout(Layout, [
    page('home', Home),
    page('newApplication', Application),
    page('application', Application)
  ])
])

export const App = component$(() => {
  listenNavigationLinks$(navigation)

  effect$((initial) => {
    const shouldReset = $location.$action() !== 'replace' && !initial

    if (shouldReset) {
      resetScroll()
    }
  })

  return pageView($page)
})
