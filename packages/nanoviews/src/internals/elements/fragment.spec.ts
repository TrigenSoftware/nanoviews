import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { signal } from 'kida'
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
          const text = signal('text')
          const number = signal(548)
          const boolean = signal(true)
          const { container } = render(ReactivePrimitives({
            text,
            number,
            boolean
          }))

          expect(container.textContent).toBe('text|548|true')

          text('Hello, nanoviews!')

          expect(container.textContent).toBe('Hello, nanoviews!|548|true')

          number(123)

          expect(container.textContent).toBe('Hello, nanoviews!|123|true')

          boolean(false)

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
