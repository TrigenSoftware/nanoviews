import {
  describe,
  it,
  expect,
  expectTypeOf
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import {
  render,
  screen
} from '@nanoviews/testing-library'
import { signal } from 'kida'
import {
  button,
  div
} from '../../elements/elements.js'
import * as Stories from './attributes.stories.js'

const {
  AutoFocus,
  ReactiveAutoFocus
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('internals', () => {
    describe('elements', () => {
      describe('attributes', () => {
        describe('autoFocus', () => {
          it('should focus element by static value', () => {
            render(AutoFocus())

            const button = screen.getByRole('button')

            expect(button.ownerDocument.activeElement).toBe(button)
          })

          it('should focus element by reactive value', () => {
            render(ReactiveAutoFocus())

            const button = screen.getByRole('button')

            expect(button.ownerDocument.activeElement).toBe(button)
          })

          it('should not focus element by a false value', () => {
            const { container } = render(() => button({
              autoFocus: false
            })('Not focused'))
            const button_ = container.querySelector('button')!

            expect(button_.ownerDocument.activeElement).not.toBe(button_)
            expect(button_.hasAttribute('autofocus')).toBe(false)
          })
        })

        describe('ref', () => {
          it('should hold the element from build to unmount', () => {
            const ref = signal<Element | null>(null)
            const { destroy } = render(() => button({
              ref
            })('Click me!'))

            expect(ref()).toBeInstanceOf(HTMLButtonElement)

            destroy()

            expect(ref()).toBe(null)
          })

          it('should take a signal of the element it sits on', () => {
            const ref = signal<HTMLButtonElement | null>(null)

            render(() => button({
              ref
            })('Click me!'))

            // the point of the precise type: no cast to reach the element's own
            // surface
            expectTypeOf(ref()).toEqualTypeOf<HTMLButtonElement | null>()
            expect(ref()!.type).toBe('submit')
          })

          it('should reject a signal of a different element', () => {
            const ref = signal<HTMLDivElement | null>(null)

            button({
              // @ts-expect-error the button is not a div
              ref
            })('Click me!')

            div({
              ref
            })
          })
        })
      })
    })
  })
})
