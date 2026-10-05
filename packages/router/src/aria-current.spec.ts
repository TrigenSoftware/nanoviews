import {
  describe,
  it,
  expect,
  vi
} from 'vitest'
import { render } from '@nanoviews/testing-library'
import { provide } from 'nanoviews/store'
import {
  component$,
  context$
} from 'nanoviews'
import {
  type Routes,
  Location$,
  Navigation$,
  buildPaths,
  virtualNavigation
} from '@nano_kit/router'
import {
  Link,
  linkComponent
} from './link.js'
import {
  ariaCurrent,
  enableLinkComponentAriaCurrent$
} from './aria-current.js'

const routes = {
  home: '/',
  about: '/about'
} as const

describe('router', () => {
  describe('aria-current', () => {
    describe('ariaCurrent', () => {
      it('should set aria-current when href matches current location', () => {
        const [$location, navigation] = virtualNavigation('/about', routes)
        const Link = linkComponent(
          navigation,
          buildPaths(routes),
          [ariaCurrent($location)]
        )
        const { container } = render(() => Link({
          to: 'about'
        })('About'))

        expect(container.querySelector('a')!.getAttribute('aria-current')).toBe('page')
      })

      it('should not set aria-current when href does not match current location', () => {
        const [$location, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(
          navigation,
          buildPaths(routes),
          [ariaCurrent($location)]
        )
        const { container } = render(() => Link({
          href: '/about'
        })('About'))

        expect(container.querySelector('a')!.getAttribute('aria-current')).toBeNull()
      })

      it('should follow the location', () => {
        const [$location, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(
          navigation,
          buildPaths(routes),
          [ariaCurrent($location)]
        )
        const { container } = render(() => Link({
          to: 'about'
        })('About'))
        const link = container.querySelector('a')!

        expect(link.getAttribute('aria-current')).toBeNull()

        navigation.push('/about')

        expect(link.getAttribute('aria-current')).toBe('page')

        navigation.push('/')

        expect(link.getAttribute('aria-current')).toBeNull()
      })

      it('should touch the attribute only when aria-current changes', () => {
        const [$location, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(
          navigation,
          buildPaths(routes),
          [ariaCurrent($location)]
        )
        const { container } = render(() => Link({
          to: 'about'
        })('About'))
        const link = container.querySelector('a')!
        const setAttribute = vi.spyOn(link, 'setAttribute')
        const removeAttribute = vi.spyOn(link, 'removeAttribute')

        navigation.push('/unknown')

        expect(setAttribute).not.toHaveBeenCalled()
        expect(removeAttribute).not.toHaveBeenCalled()

        navigation.push('/about')

        expect(setAttribute).toHaveBeenCalledTimes(1)
      })

      it('should not set aria-current on a link without href', () => {
        const [$location, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(
          navigation,
          buildPaths(routes),
          [ariaCurrent($location)]
        )
        const { container } = render(() => Link({})('Nowhere'))

        expect(container.querySelector('a')!.getAttribute('aria-current')).toBeNull()
      })

      it('should keep aria-current of the link', () => {
        const [$location, navigation] = virtualNavigation('/', routes)
        const Link = linkComponent(
          navigation,
          buildPaths(routes),
          [ariaCurrent($location)]
        )
        const { container } = render(() => Link({
          'to': 'about',
          'aria-current': 'step'
        })('About'))

        expect(container.querySelector('a')!.getAttribute('aria-current')).toBe('step')
      })

      it('should use custom isAriaCurrent predicate', () => {
        const [$location, navigation] = virtualNavigation('/about', routes)
        const isAriaCurrent = vi.fn(() => false)
        const Link = linkComponent(
          navigation,
          buildPaths(routes),
          [ariaCurrent($location, isAriaCurrent)]
        )
        const { container } = render(() => Link({
          href: '/about'
        })('About'))

        expect(isAriaCurrent).toHaveBeenCalledTimes(1)
        expect(container.querySelector('a')!.getAttribute('aria-current')).toBeNull()
      })
    })

    describe('enableLinkComponentAriaCurrent$', () => {
      it('should enable aria-current for Link component', () => {
        const [$location, navigation] = virtualNavigation<Routes>('/about', routes)
        const App = component$(() => {
          enableLinkComponentAriaCurrent$()

          return Link({
            href: '/about'
          })('About')
        })
        const { container } = render(() => context$(
          provide(Location$, $location),
          provide(Navigation$, navigation)
        )(App()))

        expect(container.querySelector('a')!.getAttribute('aria-current')).toBe('page')
      })

      it('should use custom isAriaCurrent predicate for Link component', () => {
        const [$location, navigation] = virtualNavigation<Routes>('/about', routes)
        const App = component$(() => {
          enableLinkComponentAriaCurrent$((_, location) => location.route === 'about')

          return Link({
            href: '/'
          })('Home')
        })
        const { container } = render(() => context$(
          provide(Location$, $location),
          provide(Navigation$, navigation)
        )(App()))

        expect(container.querySelector('a')!.getAttribute('aria-current')).toBe('page')
      })
    })
  })
})
