import {
  div,
  header,
  h1,
  span,
  nav,
  main,
  component$
} from 'nanoviews'
import { Outlet } from '@nanoviews/router'
import { Link } from '#src/ui/components/Link'

export const MainLayout = component$(() => div({
  class: 'main-layout-app'
})(
  header({
    class: 'main-layout-header'
  })(
    div({
      class: 'main-layout-container'
    })(
      h1({
        class: 'main-layout-title'
      })(
        span({
          class: 'main-layout-logo'
        })(
          '🛸'
        ),
        'Rick and Morty'
      ),
      nav({
        class: 'main-layout-nav'
      })(
        Link({
          to: 'characters',
          class: 'main-layout-nav-link'
        })(
          'Characters'
        ),
        Link({
          to: 'locations',
          class: 'main-layout-nav-link'
        })(
          'Locations'
        ),
        Link({
          to: 'episodes',
          class: 'main-layout-nav-link'
        })(
          'Episodes'
        )
      )
    )
  ),
  main({
    class: 'main-layout-main'
  })(
    Outlet()
  )
))
