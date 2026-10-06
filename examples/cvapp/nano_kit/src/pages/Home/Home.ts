import {
  a,
  section,
  h1,
  span,
  component$
} from 'nanoviews'
import typography from '~/uikit/typography.module.css'
import { SubHeader } from '~/uikit/SubHeader'
import { Button } from '~/uikit/Button'
import { ApplicationsGrid } from '~/blocks/ApplicationsGrid'
import { paths } from '~/stores/router'
import styles from './Home.module.css'

export const Home = component$(() => section({
  class: styles.root
})(
  SubHeader({
    title: h1({
      class: typography.h1
    })(
      'Applications'
    )
  })(
    Button({
      'class': styles.button,
      'as': a,
      'href': paths.newApplication,
      'icon': 'plus',
      'size': 'md',
      'variant': 'primary',
      'aria-label': 'Create New'
    })(
      // An element of its own, for the mobile layout to hide
      span()(
        'Create New'
      )
    )
  ),
  ApplicationsGrid()
))
