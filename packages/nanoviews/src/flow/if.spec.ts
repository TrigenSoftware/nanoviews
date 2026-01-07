import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { signal } from 'kida'
import * as Stories from './if.stories.js'

const {
  StaticValue,
  ReactiveValue,
  ReactiveValueThenOnly
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('logic', () => {
    describe('if', () => {
      it('should handle static value', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><b>True</b></div>')
      })

      it('should handle reactive value', () => {
        const value = signal(true)
        const { container } = render(ReactiveValue({
          value
        }))

        expect(container.innerHTML).toBe('<div><b>True: true</b></div>')

        value(false)

        expect(container.innerHTML).toBe('<div>False</div>')
      })

      it('should handle reactive value then only', () => {
        const value = signal(true)
        const { container } = render(ReactiveValueThenOnly({
          value
        }))

        expect(container.innerHTML).toBe('<div><b>True: true</b></div>')

        value(false)

        expect(container.innerHTML).toBe('<div></div>')
      })
    })
  })
})
