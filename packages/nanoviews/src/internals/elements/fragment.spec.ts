import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { atom } from '@nanoviews/stores'
import * as Stories from './fragment.stories.js'

const {
  StaticPrimitives,
  ReactivePrimitives,
  ChildrenBlocks
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('internals', () => {
    describe('elements', () => {
      describe('fragment', () => {
        it('should render static primitives', () => {
          const { container } = render(StaticPrimitives())

          expect(container.textContent).toBe('string|123|true|false||')
        })

        it('should render reactive primitives', () => {
          const text = atom('text')
          const number = atom(548)
          const boolean = atom(true)
          const { container } = render(ReactivePrimitives({
            text,
            number,
            boolean
          }))

          expect(container.textContent).toBe('text|548|true')

          text.set('Hello, nanoviews!')

          expect(container.textContent).toBe('Hello, nanoviews!|548|true')

          number.set(123)

          expect(container.textContent).toBe('Hello, nanoviews!|123|true')

          boolean.set(false)

          expect(container.textContent).toBe('Hello, nanoviews!|123|false')
        })

        it('should render children blocks', () => {
          const { container } = render(ChildrenBlocks())

          expect(container.innerHTML).toBe('<div>Hello, world!<br>123<br>true</div>')
        })
      })
    })
  })
})
