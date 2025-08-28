import {
  describe,
  it,
  expect,
  beforeEach
} from 'vitest'
import { fireEvent } from '@testing-library/dom'
import {
  browserNavigation,
  virtualNavigation,
  listenLinks
} from './navigation.js'
import { start } from 'kida'

describe('kida-router', () => {
  describe('navigation', () => {
    beforeEach(() => {
      window.history.replaceState(null, '', '/')
    })

    describe('browserNavigation', () => {
      it('should handle location state correctly', () => {
        window.history.replaceState(null, '', '/test?param=value#section')

        const [$location] = browserNavigation()
        const { $pathname, $search, $hash, $href } = $location

        expect($location()).toEqual({
          pathname: '/test',
          search: '?param=value',
          hash: '#section',
          href: '/test?param=value#section'
        })
        expect($pathname()).toBe('/test')
        expect($search()).toBe('?param=value')
        expect($hash()).toBe('#section')
        expect($href()).toBe('/test?param=value#section')
      })

      it('should push new state', () => {
        window.history.replaceState(null, '', '/current')

        const [$location, navigation] = browserNavigation()

        navigation.push('/new-path')

        expect($location.$href()).toBe('/new-path')
        expect(window.location.pathname).toBe('/new-path')
      })

      it('should not push new state when href is same', () => {
        window.history.replaceState(null, '', '/same')

        const lengthBefore = window.history.length
        const [, navigation] = browserNavigation()

        navigation.push('/same')

        expect(window.history.length).toBe(lengthBefore)
      })

      it('should push state with navigation update object', () => {
        window.history.replaceState(null, '', '/current?old=value#old')

        const [$location, navigation] = browserNavigation()

        navigation.push({
          pathname: '/new',
          search: '?new=value'
        })

        expect($location.$href()).toBe('/new?new=value#old')
        expect(window.location.pathname).toBe('/new')
        expect(window.location.search).toBe('?new=value')
        expect(window.location.hash).toBe('#old')
      })

      it('should replace state when href changes', () => {
        window.history.replaceState(null, '', '/current')

        const lengthBefore = window.history.length
        const [$location, navigation] = browserNavigation()

        navigation.replace('/replaced')

        expect(lengthBefore).toBe(window.history.length)
        expect($location.$href()).toBe('/replaced')
        expect(window.location.pathname).toBe('/replaced')
      })

      it('should not replace state when href is same', () => {
        window.history.replaceState(null, '', '/same')

        const [$location, navigation] = browserNavigation()
        const locationBefore = $location()

        navigation.replace('/same')

        expect($location()).toBe(locationBefore)
      })

      it('should replace state with navigation update object', () => {
        window.history.replaceState(null, '', '/current?old=value#old')

        const lengthBefore = window.history.length
        const [$location, navigation] = browserNavigation()

        navigation.replace({
          pathname: '/replaced',
          hash: '#new'
        })

        expect(lengthBefore).toBe(window.history.length)
        expect($location.$href()).toBe('/replaced?old=value#new')
        expect(window.location.pathname).toBe('/replaced')
        expect(window.location.search).toBe('?old=value')
        expect(window.location.hash).toBe('#new')
      })

      it('should remove trailing slash from pushed paths', () => {
        window.history.replaceState(null, '', '/current')

        const [$location, navigation] = browserNavigation()

        navigation.push('/new-path/')

        expect($location.$href()).toBe('/new-path')
        expect(window.location.pathname).toBe('/new-path')
      })

      it('should handle search params in navigation update', () => {
        window.history.replaceState(null, '', '/current')

        const [$location, navigation] = browserNavigation()
        const searchParams = new URLSearchParams()

        searchParams.set('param1', 'value1')
        searchParams.set('param2', 'value2')

        navigation.push({
          searchParams
        })

        expect($location.$href()).toBe('/current?param1=value1&param2=value2')
        expect(window.location.pathname).toBe('/current')
        expect(window.location.search).toBe('?param1=value1&param2=value2')
      })

      it('should update location signals when navigating', () => {
        const [$location, navigation] = browserNavigation()
        const { $pathname, $search } = $location

        expect($pathname()).toBe('/')
        expect($search()).toBe('')

        navigation.push('/new-path?param=value')

        expect($pathname()).toBe('/new-path')
        expect($search()).toBe('?param=value')
      })

      it('should handle history navigation methods', () => {
        const [, navigation] = browserNavigation()

        expect(() => navigation.go(2)).not.toThrow()
        expect(() => navigation.go(-1)).not.toThrow()
        expect(() => navigation.back()).not.toThrow()
        expect(() => navigation.forward()).not.toThrow()
      })
    })

    describe('browserNavigation with listenLinks enhancer', () => {
      it('should use listenLinks as enhancer', () => {
        const [$location] = browserNavigation(listenLinks)
        const stop = start($location)
        const link = document.createElement('a')

        link.href = '/enhanced-page'
        link.textContent = 'Enhanced Page'
        document.body.appendChild(link)

        fireEvent.click(link)

        expect($location.$href()).toBe('/enhanced-page')
        expect(window.location.pathname).toBe('/enhanced-page')

        document.body.removeChild(link)
        stop()
      })
    })

    describe('virtualNavigation', () => {
      it('should handle initial virtual state correctly', () => {
        const [$location] = virtualNavigation()
        const { $pathname, $search, $hash, $href } = $location

        expect($location()).toEqual({
          pathname: '/',
          search: '',
          hash: '',
          href: '/',
          action: null
        })
        expect($pathname()).toBe('/')
        expect($search()).toBe('')
        expect($hash()).toBe('')
        expect($href()).toBe('/')
      })

      it('should push new virtual state', () => {
        const [$location, navigation] = virtualNavigation()

        navigation.push('/virt-path')

        expect($location.$href()).toBe('/virt-path')
        expect($location().action).toBe('push')
        // Window URL is not affected by virtual navigation
        expect(window.location.pathname).toBe('/')
      })

      it('should not push when href is same', () => {
        const [$location, navigation] = virtualNavigation()
        const before = $location()

        navigation.push('/')

        expect($location()).toBe(before)
      })

      it('should push with navigation update object', () => {
        const [$location, navigation] = virtualNavigation()

        navigation.replace('/current?old=value#old')
        navigation.push({
          pathname: '/new',
          search: '?new=value'
        })

        expect($location.$href()).toBe('/new?new=value#old')
        expect($location().pathname).toBe('/new')
        expect($location().search).toBe('?new=value')
        expect($location().hash).toBe('#old')
        expect($location().action).toBe('push')
      })

      it('should replace state when href changes', () => {
        const [$location, navigation] = virtualNavigation()

        navigation.push('/first')
        navigation.replace('/replaced')

        expect($location.$href()).toBe('/replaced')
        expect($location().action).toBe('replace')
      })

      it('should not replace when href is same', () => {
        const [$location, navigation] = virtualNavigation()
        const snapshot = $location()

        navigation.replace('/')

        expect($location()).toBe(snapshot)
      })

      it('should remove trailing slash from pushed paths', () => {
        const [$location, navigation] = virtualNavigation()

        navigation.push('/new-path/')

        expect($location.$href()).toBe('/new-path')
        expect($location().pathname).toBe('/new-path')
        expect($location().action).toBe('push')
      })

      it('should handle search params in navigation update', () => {
        const [$location, navigation] = virtualNavigation()
        const searchParams = new URLSearchParams()

        searchParams.set('param1', 'value1')
        searchParams.set('param2', 'value2')

        navigation.push({
          searchParams
        })

        expect($location.$href()).toBe('/?param1=value1&param2=value2')
        expect($location().pathname).toBe('/')
        expect($location().search).toBe('?param1=value1&param2=value2')
        expect($location().action).toBe('push')
      })

      it('should update virtual location signals when navigating', () => {
        const [$location, navigation] = virtualNavigation()
        const { $pathname, $search } = $location

        expect($pathname()).toBe('/')
        expect($search()).toBe('')

        navigation.push('/new-path?param=value')

        expect($pathname()).toBe('/new-path')
        expect($search()).toBe('?param=value')
      })

      it('should handle virtual history navigation methods', () => {
        const [$location, navigation] = virtualNavigation()

        navigation.push('/a')
        navigation.push('/b')
        navigation.push('/c')

        navigation.back()
        expect($location.$href()).toBe('/b')

        navigation.back()
        expect($location.$href()).toBe('/a')

        navigation.forward()
        expect($location.$href()).toBe('/b')

        navigation.go(1)
        expect($location.$href()).toBe('/c')

        navigation.go(-10)
        expect($location.$href()).toBe('/')

        navigation.go(100)
        expect($location.$href()).toBe('/c')
      })
    })
  })
})
