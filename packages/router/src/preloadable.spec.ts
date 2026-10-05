import {
  describe,
  it,
  expect,
  vi
} from 'vitest'
import {
  render,
  fireEvent
} from '@nanoviews/testing-library'
import { provide } from 'nanoviews/store'
import {
  div,
  component$,
  context$
} from 'nanoviews'
import {
  type Routes,
  Navigation$,
  Pages$,
  buildPaths,
  virtualNavigation
} from '@nano_kit/router'
import {
  page,
  loadable
} from './type-overrides.js'
import {
  Link,
  linkComponent
} from './link.js'
import {
  preloadable,
  enableLinkComponentPreload$
} from './preloadable.js'

const routes = {
  home: '/',
  about: '/about'
} as const
const about = Promise.resolve({
  default: component$(() => div()('About Page'))
})

describe('router', () => {
  describe('preloadable', () => {
    describe('preloadable', () => {
      it('should preload page on focus or mouse enter when preload is enabled', async () => {
        const aboutLoader = vi.fn(() => about)
        const Link = linkComponent(
          virtualNavigation('/', routes)[1],
          buildPaths(routes),
          [preloadable([page('about', loadable(aboutLoader))])]
        )
        const onFocus = vi.fn()
        const onMouseEnter = vi.fn()
        const { container } = render(() => Link({
          to: 'about',
          preload: true,
          onFocus,
          onMouseEnter
        })('About'))
        const link = container.querySelector('a')!

        fireEvent.focus(link)
        fireEvent.mouseEnter(link)

        await about

        expect(onFocus).toHaveBeenCalledTimes(1)
        expect(onMouseEnter).toHaveBeenCalledTimes(1)
        expect(aboutLoader).toHaveBeenCalledTimes(1)
      })

      it('should not preload page when preload is disabled by default', () => {
        const aboutLoader = vi.fn(() => about)
        const Link = linkComponent(
          virtualNavigation('/', routes)[1],
          buildPaths(routes),
          [preloadable([page('about', loadable(aboutLoader))])]
        )
        const { container } = render(() => Link({
          to: 'about'
        })('About'))
        const link = container.querySelector('a')!

        fireEvent.focus(link)
        fireEvent.mouseEnter(link)

        expect(aboutLoader).not.toHaveBeenCalled()
      })

      it('should preload page by default when enabled in preloadable settings', async () => {
        const aboutLoader = vi.fn(() => about)
        const Link = linkComponent(
          virtualNavigation('/', routes)[1],
          buildPaths(routes),
          [preloadable(() => [page('about', loadable(aboutLoader))], true)]
        )
        const { container } = render(() => Link({
          to: 'about'
        })('About'))

        fireEvent.mouseEnter(container.querySelector('a')!)

        await about

        expect(aboutLoader).toHaveBeenCalledTimes(1)
      })

      it('should not preload page when the link opts out of default preload', () => {
        const aboutLoader = vi.fn(() => about)
        const Link = linkComponent(
          virtualNavigation('/', routes)[1],
          buildPaths(routes),
          [preloadable([page('about', loadable(aboutLoader))], true)]
        )
        const { container } = render(() => Link({
          to: 'about',
          preload: false
        })('About'))

        fireEvent.mouseEnter(container.querySelector('a')!)

        expect(aboutLoader).not.toHaveBeenCalled()
      })
    })

    describe('enableLinkComponentPreload$', () => {
      it('should enable preload by default for Link component', async () => {
        const aboutLoader = vi.fn(() => about)
        const pages = [
          page('about', loadable(aboutLoader))
        ]
        const navigation = virtualNavigation<Routes>('/', routes)[1]
        const App = component$(() => {
          enableLinkComponentPreload$(true)

          return Link({
            to: 'about'
          })('About')
        })
        const { container } = render(() => context$(
          provide(Navigation$, navigation),
          provide(Pages$, pages)
        )(App()))

        fireEvent.mouseEnter(container.querySelector('a')!)

        await about

        expect(aboutLoader).toHaveBeenCalledTimes(1)
      })
    })
  })
})
