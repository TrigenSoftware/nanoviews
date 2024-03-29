import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import {
  render,
  screen
} from '@nanoviews/testing-library'
import { atom } from 'nanostores'
import * as Stories from './for.stories.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('logic', () => {
    describe('for', () => {
      it('should handle static array', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><ul><li>Yatoro</li><li>Larl</li><li>Collapse</li><li>Mira</li><li>Miposhka</li></ul></div>')
      })

      it('should handle reactive array', () => {
        const items = atom([
          'Yatoro',
          'Larl',
          'Collapse',
          'Mira',
          'Miposhka'
        ])
        const { container } = render(ReactiveValue({
          items
        }))

        expect(container.innerHTML).toBe('<div><ul><li>Yatoro</li><li>Larl</li><li>Collapse</li><li>Mira</li><li>Miposhka</li></ul></div>')

        items.set([
          'Yatoro',
          'Torontotokyo',
          'Collapse',
          'Mira',
          'Miposhka'
        ])

        expect(container.innerHTML).toBe('<div><ul><li>Yatoro</li><li>Torontotokyo</li><li>Collapse</li><li>Mira</li><li>Miposhka</li></ul></div>')
      })

      it('should not recreate nodes', () => {
        const midlaner = atom('Larl')
        const items = atom([
          'Yatoro',
          midlaner,
          'Collapse',
          'Mira',
          'Miposhka'
        ])

        render(ReactiveValue({
          items
        }))

        const listItems = [
          screen.getByText('Yatoro'),
          screen.getByText('Larl'),
          screen.getByText('Collapse'),
          screen.getByText('Mira'),
          screen.getByText('Miposhka')
        ]

        items.set([
          'Yatoro',
          'Collapse',
          'Mira',
          'Miposhka',
          midlaner
        ])

        ;[
          screen.getByText('Yatoro'),
          screen.getByText('Larl'),
          screen.getByText('Collapse'),
          screen.getByText('Mira'),
          screen.getByText('Miposhka')
        ].forEach((item, index) => {
          expect(item).toBe(listItems[index])
        })

        midlaner.set('Torontotokyo')

        ;[
          screen.getByText('Yatoro'),
          screen.getByText('Torontotokyo'),
          screen.getByText('Collapse'),
          screen.getByText('Mira'),
          screen.getByText('Miposhka')
        ].forEach((item, index) => {
          expect(item).toBe(listItems[index])
        })
      })
    })
  })
})
