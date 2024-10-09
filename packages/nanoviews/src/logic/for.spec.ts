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
import {
  list,
  entities,
  record
} from '@nanoviews/stores'
import * as Stories from './for.stories.js'

const {
  StaticValue,
  ReactiveValue,
  EntitiesValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('logic', () => {
    describe('for', () => {
      it('should handle static array', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><ul><li>Yatoro</li><li>Larl</li><li>Collapse</li><li>Mira</li><li>Miposhka</li></ul></div>')
      })

      it('should handle reactive array', () => {
        const items = list([
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
          'Satanic',
          'Larl',
          'Collapse',
          'Rue',
          'Miposhka'
        ])

        expect(container.innerHTML).toBe('<div><ul><li>Satanic</li><li>Larl</li><li>Collapse</li><li>Rue</li><li>Miposhka</li></ul></div>')
      })

      it('should render placeholder', () => {
        const items = list([
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

        items.set([])

        expect(container.innerHTML).toBe('<div><ul><li>No items</li></ul></div>')
      })

      it('should not recreate nodes', () => {
        const items = list([
          'Satanic',
          'Larl',
          'Collapse',
          'Rue',
          'Miposhka'
        ])
        const { container } = render(ReactiveValue({
          items
        }))

        expect(container.innerHTML).toBe('<div><ul><li>Satanic</li><li>Larl</li><li>Collapse</li><li>Rue</li><li>Miposhka</li></ul></div>')

        const listItems = [
          screen.getByText('Satanic'),
          screen.getByText('Larl'),
          screen.getByText('Collapse'),
          screen.getByText('Rue'),
          screen.getByText('Miposhka')
        ]

        items.set([
          'Satanic',
          'Larl',
          'Malik',
          'Rue',
          'Miposhka'
        ])

        expect(container.innerHTML).toBe('<div><ul><li>Satanic</li><li>Larl</li><li>Malik</li><li>Rue</li><li>Miposhka</li></ul></div>')

        ;[
          screen.getByText('Satanic'),
          screen.getByText('Larl'),
          screen.getByText('Malik'),
          screen.getByText('Rue'),
          screen.getByText('Miposhka')
        ].forEach((item, index) => {
          expect(item).toBe(listItems[index])
        })
      })

      it('should reorder nodes', () => {
        const items = entities([
          {
            id: 1,
            name: 'Satanic'
          },
          {
            id: 2,
            name: 'Larl'
          },
          {
            id: 3,
            name: 'Collapse'
          },
          {
            id: 4,
            name: 'Rue'
          },
          {
            id: 5,
            name: 'Miposhka'
          }
        ], record)
        const { container } = render(EntitiesValue({
          items
        }))

        expect(container.innerHTML).toBe('<div><ul><li>Satanic</li><li>Larl</li><li>Collapse</li><li>Rue</li><li>Miposhka</li></ul></div>')

        const listItems = [
          screen.getByText('Satanic'),
          screen.getByText('Larl'),
          screen.getByText('Collapse'),
          screen.getByText('Rue'),
          screen.getByText('Miposhka')
        ]

        items.set([
          {
            id: 5,
            name: 'Miposhka'
          },
          {
            id: 4,
            name: 'Rue'
          },
          {
            id: 3,
            name: 'Collapse'
          },
          {
            id: 2,
            name: 'Larl'
          },
          {
            id: 1,
            name: 'Satanic'
          }
        ])

        expect(container.innerHTML).toBe('<div><ul><li>Miposhka</li><li>Rue</li><li>Collapse</li><li>Larl</li><li>Satanic</li></ul></div>')

        ;[
          screen.getByText('Satanic'),
          screen.getByText('Larl'),
          screen.getByText('Collapse'),
          screen.getByText('Rue'),
          screen.getByText('Miposhka')
        ].forEach((item, index) => {
          expect(item).toBe(listItems[index])
        })
      })
    })
  })
})
