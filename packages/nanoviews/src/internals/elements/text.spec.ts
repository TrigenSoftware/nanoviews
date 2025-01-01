import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { signal } from 'kida'
import * as Stories from './text.stories.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('internals', () => {
    describe('elements', () => {
      describe('text', () => {
        it('should render static value', () => {
          const { container } = render(StaticValue())

          expect(container.textContent).toBe('Hello, world!')
        })

        it('should render reactive value', () => {
          const value = signal('Hello, world!')
          const { container } = render(ReactiveValue({
            value
          }))

          expect(container.textContent).toBe('Hello, world!')

          value.set('Hello, nanoviews!')

          expect(container.textContent).toBe('Hello, nanoviews!')
        })
      })
    })
  })
})
