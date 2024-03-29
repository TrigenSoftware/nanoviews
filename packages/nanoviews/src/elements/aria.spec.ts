import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { atom } from 'nanostores'
import * as Stories from './aria.stories.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('aria$', () => {
      it('should render static value', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><div aria-description="Test div description">Hello, world!</div></div>')
      })

      it('should render reactive value', () => {
        const description = atom('Test div description')
        const { container } = render(ReactiveValue({
          description
        }))

        expect(container.innerHTML).toBe('<div><div aria-description="Test div description">Hello, world!</div></div>')

        description.set('its nanoviews!')

        expect(container.innerHTML).toBe('<div><div aria-description="its nanoviews!">Hello, world!</div></div>')
      })
    })
  })
})
