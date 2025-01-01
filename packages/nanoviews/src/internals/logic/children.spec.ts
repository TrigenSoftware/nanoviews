import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import * as Stories from './children.stories.js'

const {
  NoSlot,
  Slot,
  Slots
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('internals', () => {
    describe('logic', () => {
      describe('children', () => {
        it('should render without slot', () => {
          const { container } = render(NoSlot())

          expect(container.innerHTML).toBe('<div><div>Children: Hello!</div></div>')
        })

        it('should render slot', () => {
          const { container } = render(Slot())

          expect(container.innerHTML).toBe('<div><div>Children: Hello! World!</div></div>')
        })

        it('should render slots', () => {
          const { container } = render(Slots())

          expect(container.innerHTML).toBe('<div><div>Hello! World! From Slot!</div></div>')
        })
      })
    })
  })
})
