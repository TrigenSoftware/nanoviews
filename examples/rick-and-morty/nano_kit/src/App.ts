import { component$ } from 'nanoviews'
import {
  router,
  pageView
} from '@nanoviews/router'
import { $location } from './stores/router'
import { pages } from './pages'

const $page = router($location, pages)

export const App = component$(() => pageView($page))
