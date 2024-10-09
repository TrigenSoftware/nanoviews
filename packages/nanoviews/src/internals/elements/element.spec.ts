import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import {
  render,
  screen,
  fireEvent
} from '@nanoviews/testing-library'
import { atom } from '@nanoviews/stores'
import * as Stories from './element.stories.js'
import { createElement } from './element.js'

const {
  StaticPrimitiveChild,
  ReactivePrimitiveChild,
  StaticPrimitiveAttribute,
  ReactivePrimitiveAttribute,
  Events,
  Children,
  NoChildren
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('internals', () => {
    describe('elements', () => {
      describe('element', () => {
        it('should render static primitive child', () => {
          const { container } = render(StaticPrimitiveChild())

          expect(container.innerHTML).toBe('<div><b>Hello, world!</b></div>')
        })

        it('should render reactive primitive child', () => {
          const text = atom('Hello, world!')
          const { container } = render(ReactivePrimitiveChild({
            text
          }))

          expect(container.innerHTML).toBe('<div><b>Hello, world!</b></div>')

          text.set('Hello, nanoviews!')

          expect(container.innerHTML).toBe('<div><b>Hello, nanoviews!</b></div>')
        })

        it('should render static primitive attribute', () => {
          const { container } = render(StaticPrimitiveAttribute())

          expect(container.innerHTML).toBe('<div><a href="#">Link!</a></div>')
        })

        it('should render reactive primitive attribute', () => {
          const href = atom('#')
          const { container } = render(ReactivePrimitiveAttribute({
            href
          }))

          expect(container.innerHTML).toBe('<div><a href="#">Link!</a></div>')

          href.set('https://github.com/dangreen')

          expect(container.innerHTML).toBe('<div><a href="https://github.com/dangreen">Link!</a></div>')
        })

        it('should remove reactive attribute', () => {
          const href = atom<string | undefined>('#')
          const { container } = render(ReactivePrimitiveAttribute({
            href
          }))

          expect(container.innerHTML).toBe('<div><a href="#">Link!</a></div>')

          // @ts-expect-error - test case
          href.set(null)

          expect(container.innerHTML).toBe('<div><a>Link!</a></div>')

          href.set('#')

          expect(container.innerHTML).toBe('<div><a href="#">Link!</a></div>')

          href.set(undefined)

          expect(container.innerHTML).toBe('<div><a>Link!</a></div>')
        })

        it('should render boolean reactive attribute', () => {
          const dataValue = atom<string | boolean>('#')
          const { container } = render(createElement('span', {
            'data-value': dataValue
          })('Data attribute test'))

          expect(container.innerHTML).toBe('<div><span data-value="#">Data attribute test</span></div>')

          dataValue.set(true)

          expect(container.innerHTML).toBe('<div><span data-value="true">Data attribute test</span></div>')

          dataValue.set(false)

          expect(container.innerHTML).toBe('<div><span data-value="false">Data attribute test</span></div>')
        })

        it('should handle events', () => {
          const onClick = vi.fn()
          const { container } = render(Events({
            onClick
          }))

          expect(container.innerHTML).toBe('<div><button>Click me!</button></div>')

          fireEvent.click(screen.getByRole('button'))

          expect(onClick).toHaveBeenCalled()
        })

        it('should render children', () => {
          const { container } = render(Children())

          expect(container.innerHTML).toBe('<div><ul><li>One</li><li>Two</li><li>Three</li></ul></div>')
        })

        it('should render no elements without children', () => {
          const { container } = render(NoChildren())

          expect(container.innerHTML).toBe('<div><div><hr>^ hr, br &gt;<br>^ br, hr &gt;<hr></div></div>')
        })
      })
    })
  })
})
