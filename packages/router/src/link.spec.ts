import {
  describe,
  it,
  expect,
  vi
} from 'vitest'
import { render } from '@nanoviews/testing-library'
import {
  signal,
  provide
} from 'nanoviews/store'
import {
  a,
  div,
  nav,
  fragment,
  component$,
  context$
} from 'nanoviews'
import {
  type Routes,
  Navigation$,
  buildPaths,
  virtualNavigation
} from '@nano_kit/router'
import {
  page,
  notFound
} from './type-overrides.js'
import {
  router,
  pageView
} from './core.js'
import {
  Link,
  linkComponent,
  listenNavigationLinks$,
  listenLinks$
} from './link.js'

const routes = {
  home: '/',
  about: '/about',
  user: '/users/:id',
  post: '/posts/:id/:slug?',
  search: '/search/:query?'
} as const

describe('router', () => {
  describe('link', () => {
    describe('linkComponent', () => {
      it('should build href from the route and its params', () => {
        const [, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(navigation, buildPaths(routes))
        const { container } = render(() => fragment(
          Link({
            to: 'about'
          })('About'),
          Link({
            to: 'user',
            params: {
              id: 1
            }
          })('User'),
          Link({
            href: '/external'
          })('External')
        ))

        expect(container.innerHTML).toBe(
          '<div><a href="/about">About</a><a href="/users/1">User</a><a href="/external">External</a></div>'
        )
      })

      it('should follow params accessor', () => {
        const [, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(navigation, buildPaths(routes))
        const $id = signal(1)
        const { container } = render(() => Link({
          to: 'user',
          params: () => ({
            id: $id()
          })
        })('User'))

        expect(container.querySelector('a')!.getAttribute('href')).toBe('/users/1')

        $id(2)

        expect(container.querySelector('a')!.getAttribute('href')).toBe('/users/2')
      })

      it('should navigate on click without full page reload', () => {
        const [$location, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(navigation, buildPaths(routes))
        const $page = router($location, [
          page('home', () => div()('Home Page')),
          page('about', () => div()('About Page')),
          notFound(() => div()('Not Found'))
        ])
        const { container } = render(() => fragment(
          nav()(
            Link({
              to: 'home'
            })('Home'),
            Link({
              to: 'about'
            })('About')
          ),
          pageView($page)
        ))
        const [homeLink, aboutLink] = container.querySelectorAll('a')

        expect(container.innerHTML).toContain('Home Page')

        aboutLink.click()

        expect(container.innerHTML).toContain('About Page')
        expect($location().href).toBe('/about')

        homeLink.click()

        expect(container.innerHTML).toContain('Home Page')
        expect($location().href).toBe('/')
      })

      it('should call onClick of the link before navigation', () => {
        const [$location, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(navigation, buildPaths(routes))
        const onClick = vi.fn(() => {
          expect($location().href).toBe('/')
        })
        const { container } = render(() => Link({
          to: 'about',
          onClick
        })('About'))

        container.querySelector('a')!.click()

        expect(onClick).toHaveBeenCalledTimes(1)
        expect($location().href).toBe('/about')
      })

      it('should not navigate when onClick of the link prevents default', () => {
        const [$location, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(navigation, buildPaths(routes))
        const { container } = render(() => Link({
          to: 'about',
          onClick(event) {
            event.preventDefault()
          }
        })('About'))

        container.querySelector('a')!.click()

        expect($location().href).toBe('/')
      })

      it('should add the attributes of every hook once', () => {
        const [, navigation] = virtualNavigation('/', routes)
        const first = vi.fn(() => ({
          'data-first': ''
        }))
        const second = vi.fn(() => ({
          'data-second': ''
        }))
        const Link = linkComponent(navigation, buildPaths(routes), [
          first,
          second,
          first
        ])
        const { container } = render(() => Link({
          to: 'about'
        })('About'))

        expect(container.innerHTML).toBe('<div><a href="/about" data-first="" data-second="">About</a></div>')
        expect(first).toHaveBeenCalledTimes(1)
        expect(first).toHaveBeenCalledWith(expect.objectContaining({
          to: 'about',
          href: '/about'
        }), expect.anything())
      })

      it('should type params by the route', () => {
        const [, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(navigation, buildPaths(routes))

        Link({
          to: 'post',
          params: {
            id: 1
          }
        })
        Link({
          to: 'search'
        })

        // @ts-expect-error the route has a required param
        Link({
          to: 'user'
        })

        Link({
          to: 'about',
          // @ts-expect-error the route has no params
          params: {
            id: 1
          }
        })

        // @ts-expect-error a link to a route takes no href
        Link({
          to: 'about',
          href: '/about'
        })
      })
    })

    describe('Link', () => {
      it('should navigate with the navigation from the injection context', () => {
        const [$location, navigation] = virtualNavigation<Routes>('/', routes)
        const { container } = render(() => context$(provide(Navigation$, navigation))(
          Link({
            to: 'about'
          })('About')
        ))
        const link = container.querySelector('a')!

        expect(link.getAttribute('href')).toBe('/about')

        link.click()

        expect($location().href).toBe('/about')
      })
    })

    describe('listenNavigationLinks$', () => {
      it('should navigate on click of a raw link while the view is mounted', () => {
        const [$location, navigation] = virtualNavigation('/', routes)
        const App = component$(() => {
          listenNavigationLinks$(navigation)

          return a({
            href: '/about'
          })('About')
        })
        const { container, destroy } = render(() => App())
        const link = container.querySelector('a')!
        // Whatever the listener does, the document is not navigated away
        const preventNavigation = (event: Event) => event.preventDefault()

        window.addEventListener('click', preventNavigation)

        try {
          link.click()

          expect($location().href).toBe('/about')

          navigation.push('/')
          destroy()
          document.body.appendChild(link)
          link.click()
          link.remove()

          expect($location().href).toBe('/')
        } finally {
          window.removeEventListener('click', preventNavigation)
        }
      })
    })

    describe('listenLinks$', () => {
      it('should navigate with the navigation from the injection context', () => {
        const [$location, navigation] = virtualNavigation<Routes>('/', routes)
        const App = component$(() => {
          listenLinks$()

          return a({
            href: '/about'
          })('About')
        })
        const { container } = render(() => context$(provide(Navigation$, navigation))(App()))

        container.querySelector('a')!.click()

        expect($location().href).toBe('/about')
      })
    })
  })
})
