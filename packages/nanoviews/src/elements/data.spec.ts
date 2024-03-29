import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { atom } from 'nanostores'
import * as Stories from './data.stories.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('data$', () => {
      it('should render static value', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><div data-payload="Test div data payload">Hello, world!</div></div>')
      })

      it('should render reactive value', () => {
        const payload = atom('Test div data payload')
        const { container } = render(ReactiveValue({
          payload
        }))

        expect(container.innerHTML).toBe('<div><div data-payload="Test div data payload">Hello, world!</div></div>')

        payload.set('its nanoviews!')

        expect(container.innerHTML).toBe('<div><div data-payload="its nanoviews!">Hello, world!</div></div>')
      })
    })
  })
})
