import { effect } from '@nano_kit/store'
import {
  page,
  layout,
  resetScroll,
  useListenLinks,
  router,
  usePage
} from '@nano_kit/react-router'
import { useEffect } from 'react'
import {
  $location,
  $prevRoute,
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

export function App() {
  const Page = usePage($page)

  useListenLinks(navigation)

  useEffect(() => effect((initial) => {
    const shouldReset = (
      $prevRoute() !== 'newApplication'
      || $location.$route() !== 'application'
    ) && !initial

    if (shouldReset) {
      resetScroll()
    }
  }), [])

  return Page && <Page/>
}
