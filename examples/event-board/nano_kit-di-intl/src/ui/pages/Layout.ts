import {
  inject,
  record,
  is
} from 'nanoviews/store'
import {
  div,
  header,
  nav,
  strong,
  button,
  main,
  footer,
  span,
  fragment,
  component$,
  if_
} from 'nanoviews'
import {
  Link,
  Outlet,
  lang,
  meta,
  title,
  enableLinkComponentAriaCurrent$,
  enableLinkComponentPreload$,
  syncHead$
} from '@nanoviews/router'
import { Intl$ } from '#src/stores/intl'
import { User$ } from '#src/stores/user'

function Messages$() {
  const { messages } = inject(Intl$)

  return messages('layout')
}

export function Head$() {
  const { $locale } = inject(Intl$)
  const [$t] = inject(Messages$)

  return [
    lang($locale),
    title($t.$title),
    meta({
      charSet: 'utf-8'
    }),
    meta({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    })
  ]
}

const Layout = component$(() => {
  const {
    $locale,
    $loading,
    supportedLocales
  } = inject(Intl$)
  const {
    $user,
    logout
  } = inject(User$)
  const [$t] = inject(Messages$)
  const onLogout = () => {
    void logout()
  }

  syncHead$()
  enableLinkComponentPreload$(true)
  enableLinkComponentAriaCurrent$()

  return div({
    class: 'app'
  })(
    header({
      class: 'header'
    })(
      div({
        class: 'container header__inner'
      })(
        Link({
          to: 'home',
          class: 'brand'
        })(
          $t.$title
        ),
        nav({
          class: 'nav'
        })(
          Link({
            to: 'home'
          })(
            $t.$events
          ),
          Link({
            to: 'newEvent'
          })(
            $t.$newEvent
          )
        ),
        div({
          class: 'header__user'
        })(
          if_($user)(
            $user => fragment(
              strong()(
                record($user).$name
              ),
              button({
                class: 'button_link',
                type: 'button',
                onClick: onLogout
              })(
                $t.$logout
              )
            ),
            () => Link({
              to: 'login'
            })(
              $t.$login
            )
          )
        )
      )
    ),
    main({
      class: 'container main'
    })(
      Outlet()
    ),
    footer({
      class: 'footer'
    })(
      div({
        class: 'container footer__inner'
      })(
        div({
          class: 'locale-field'
        })(
          span()(
            $t.$language
          ),
          div({
            'class': 'locale-switcher',
            'role': 'group',
            'aria-label': $t.$language
          })(
            ...supportedLocales.map(supportedLocale => button({
              'class': 'locale-switcher__button',
              'type': 'button',
              'aria-pressed': is($locale, supportedLocale),
              'onClick': () => $locale(supportedLocale)
            })(
              supportedLocale.toUpperCase()
            ))
          )
        )
      )
    ),
    if_($loading)(
      () => div({
        'class': 'loading-overlay',
        'role': 'status',
        'aria-live': 'polite'
      })(
        div({
          class: 'loading-overlay__content'
        })(
          span({
            'class': 'loading-overlay__spinner',
            'aria-hidden': 'true'
          }),
          span()(
            $t.$loading
          )
        )
      )
    )
  )
})

export default Layout
