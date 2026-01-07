import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import {
  render,
  screen
} from '@nanoviews/testing-library'
import { signal } from 'kida'
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
        const items = signal([
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

        items([
          'Satanic',
          'Larl',
          'Collapse',
          'Rue',
          'Miposhka'
        ])

        expect(container.innerHTML).toBe('<div><ul><li>Satanic</li><li>Larl</li><li>Collapse</li><li>Rue</li><li>Miposhka</li></ul></div>')
      })

      it('should render placeholder', () => {
        const items = signal([
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

        items([])

        expect(container.innerHTML).toBe('<div><ul><li>No items</li></ul></div>')
      })

      it('should not recreate nodes', () => {
        const items = signal([
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

        items([
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

      it('should swap nodes', () => {
        const items = signal([
          {
            id: 1,
            name: 'Satanic'
          },
          {
            id: 2,
            name: 'Larl'
          }
        ])
        const onEffect = vi.fn()
        const { container } = render(EntitiesValue({
          onEffect,
          items
        }))

        expect(container.innerHTML).toBe('<div><ul><li>Satanic</li><li>Larl</li></ul></div>')

        expect(onEffect.mock.calls).toEqual([['Satanic'], ['Larl']])
        onEffect.mock.calls.length = 0

        const listItems = [screen.getByText('Satanic'), screen.getByText('Larl')]

        items([
          {
            id: 0,
            name: 'Yatoro'
          },
          {
            id: 2,
            name: 'Larl'
          }
        ])

        expect(container.innerHTML).toBe('<div><ul><li>Yatoro</li><li>Larl</li></ul></div>')

        expect(onEffect.mock.calls).toEqual([['Yatoro']])
        onEffect.mock.calls.length = 0

        expect(listItems[0]).not.toBe(screen.queryByText('Satanic'))
        expect(listItems[1]).toBe(screen.getByText('Larl'))
      })

      it('should reorder nodes', () => {
        const items = signal([
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
        ])
        const onEffect = vi.fn()
        const { container } = render(EntitiesValue({
          onEffect,
          items
        }))

        expect(container.innerHTML).toBe('<div><ul><li>Satanic</li><li>Larl</li><li>Collapse</li><li>Rue</li><li>Miposhka</li></ul></div>')

        expect(onEffect.mock.calls).toEqual([
          ['Satanic'],
          ['Larl'],
          ['Collapse'],
          ['Rue'],
          ['Miposhka']
        ])
        onEffect.mock.calls.length = 0

        const listItems = [
          screen.getByText('Satanic'),
          screen.getByText('Larl'),
          screen.getByText('Collapse'),
          screen.getByText('Rue'),
          screen.getByText('Miposhka')
        ]

        items([
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

        expect(onEffect.mock.calls).toEqual([])
        onEffect.mock.calls.length = 0

        ;[
          screen.getByText('Satanic'),
          screen.getByText('Larl'),
          screen.getByText('Collapse'),
          screen.getByText('Rue'),
          screen.getByText('Miposhka')
        ].forEach((item, index) => {
          expect(item).toBe(listItems[index])
        })

        items([
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
            id: 0,
            name: 'Yatoro'
          }
        ])

        expect(container.innerHTML).toBe('<div><ul><li>Miposhka</li><li>Rue</li><li>Collapse</li><li>Larl</li><li>Yatoro</li></ul></div>')

        expect(onEffect.mock.calls).toEqual([['Yatoro']])

        expect(screen.getByText('Larl')).toBe(listItems[1])
        expect(screen.getByText('Collapse')).toBe(listItems[2])
        expect(screen.getByText('Rue')).toBe(listItems[3])
        expect(screen.getByText('Miposhka')).toBe(listItems[4])
      })
    })
  })
})
