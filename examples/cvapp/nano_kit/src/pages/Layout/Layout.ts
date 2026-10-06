import {
  a,
  div,
  header,
  main,
  footer,
  component$
} from 'nanoviews'
import { Outlet } from '@nanoviews/router'
import { ApplicationsProgress } from '~/blocks/ApplicationsProgress'
import { Button } from '~/uikit/Button'
import { paths } from '~/stores/router'
import { CallToAction } from '~/blocks/CallToAction'
import mixins from '~/uikit/mixins.module.css'
import styles from './Layout.module.css'

export const Layout = component$(() => div({
  class: styles.root
})(
  header({
    class: styles.header
  })(
    a({
      'class': `${styles.logo} ${mixins.focusOutline}`,
      'href': paths.home,
      'aria-label': 'Go to home page'
    })(
      'CV App'
    ),
    div({
      class: styles.actions
    })(
      ApplicationsProgress(),
      Button({
        'as': a,
        'href': paths.home,
        'icon': 'home',
        'size': 'sm',
        'aria-label': 'Go to home page'
      })
    )
  ),
  main()(
    Outlet()
  ),
  footer({
    class: styles.footer
  })(
    CallToAction()
  )
))
