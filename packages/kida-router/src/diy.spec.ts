import {
  beforeEach,
  describe,
  it,
  expect
} from 'vitest'
import { fireEvent } from '@testing-library/dom'
import {
  onMount,
  start
} from 'kida'
import { browserNavigation } from './navigation.js'
import { listenLinks } from './diy.js'

describe('kid-router', () => {
  describe('diy', () => {
    beforeEach(() => {
      window.history.replaceState(null, '', '/')
    })

    describe('listenLinks', () => {
      it('should navigate on link click', () => {
        const [$location, navigation] = browserNavigation()
        const stopMount = onMount($location, () => listenLinks(navigation))
        const link = document.createElement('a')

        link.href = '/enhanced-page'
        link.textContent = 'Enhanced Page'
        document.body.appendChild(link)

        const stop = start($location)

        expect($location.$href()).toBe('/')
        expect(window.location.pathname).toBe('/')

        fireEvent.click(link)

        expect($location.$href()).toBe('/enhanced-page')
        expect(window.location.pathname).toBe('/enhanced-page')

        document.body.removeChild(link)
        stop()
        stopMount()
      })
    })
  })
})
