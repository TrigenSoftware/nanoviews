import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import * as Stories from './children.stories.js'

const {
  NoChildren,
  PrimitiveChild,
  BlockChild,
  Children,
  NoSlot,
  Slot,
  Slots
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('internals', () => {
    describe('logic', () => {
      describe('children', () => {
        it('should render without children', () => {
          const { container } = render(NoChildren())

          expect(container.innerHTML).toBe('<div><div>No children:</div></div>')
        })

        it('should render primitive child', () => {
          const { container } = render(PrimitiveChild())

          expect(container.innerHTML).toBe('<div><div>Primitive child: Hello, world!</div></div>')
        })

        it('should render block child', () => {
          const { container } = render(BlockChild())

          expect(container.innerHTML).toBe('<div><div>Block child: <b>Hello, world!</b></div></div>')
        })

        it('should render children', () => {
          const { container } = render(Children())

          expect(container.innerHTML).toBe('<div><div>Children: Hello, <b>world!</b></div></div>')
        })

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
