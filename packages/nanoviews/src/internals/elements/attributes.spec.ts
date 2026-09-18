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
import { button } from '../../elements/elements.js'
import { input } from '../../elements/controls.js'
import * as Stories from './attributes.stories.js'

const {
  AutoFocus,
  ReactiveAutoFocus,
  StaticStyle,
  ReactiveStyle,
  StyleCustomProperties,
  StyleMultiWordProperties,
  StyleChangingShape
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('internals', () => {
    describe('elements', () => {
      describe('attributes', () => {
        describe('autoFocus', () => {
          it('should focus element by static value', () => {
            render(AutoFocus())

            const textbox = screen.getByRole('textbox')

            expect(textbox.ownerDocument.activeElement).toBe(textbox)
          })

          it('should focus element by reactive value', () => {
            render(ReactiveAutoFocus())

            const textbox = screen.getByRole('textbox')

            expect(textbox.ownerDocument.activeElement).toBe(textbox)
          })

          it('should not focus element by a false value', () => {
            const { container } = render(() => button({
              autoFocus: false
            })('Not focused'))
            const target = container.querySelector('button')!

            expect(target.ownerDocument.activeElement).not.toBe(target)
            expect(target.hasAttribute('autofocus')).toBe(false)
          })
        })

        describe('style', () => {
          it('should render static value', () => {
            const { container } = render(StaticStyle())

            expect(container.innerHTML).toBe('<div><div style="color: green;">Hello, world!</div></div>')
          })

          it('should render reactive value', () => {
            const color = signal('green')
            const { container } = render(ReactiveStyle({
              color
            }))

            expect(container.innerHTML).toBe('<div><div style="color: green;">Hello, world!</div></div>')

            color('red')

            expect(container.innerHTML).toBe('<div><div style="color: red;">Hello, world!</div></div>')
          })

          it('should render custom properties', () => {
            const color = signal('green')
            const { container } = render(StyleCustomProperties({
              color
            }))

            expect(container.innerHTML).toBe('<div><div style="--accent: green; --gap: 4px;">Hello, world!</div></div>')

            color('red')

            expect(container.innerHTML).toBe('<div><div style="--accent: red; --gap: 4px;">Hello, world!</div></div>')
          })

          it('should render multi-word properties', () => {
            const color = signal('green')
            const { container } = render(StyleMultiWordProperties({
              color
            }))

            expect(container.innerHTML).toBe('<div><div style="background-color: green; font-size: 12px;">Hello, world!</div></div>')

            color('red')

            expect(container.innerHTML).toBe('<div><div style="background-color: red; font-size: 12px;">Hello, world!</div></div>')
          })

          it('should drop the properties the new object no longer names', () => {
            const bold = signal(true)
            const { container } = render(StyleChangingShape({
              bold
            }))

            expect(container.innerHTML).toBe('<div><div style="font-weight: bold; color: red;">Hello, world!</div></div>')

            bold(false)

            expect(container.innerHTML).toBe('<div><div style="color: blue;">Hello, world!</div></div>')

            bold(true)

            expect(container.innerHTML).toBe('<div><div style="color: red; font-weight: bold;">Hello, world!</div></div>')
          })
        })

        describe('ref', () => {
          it('should set ref', () => {
            const ref = signal<Element | null>(null)

            render(() => button({
              ref
            })('Click me!'))

            expect(ref()).toBeInstanceOf(HTMLButtonElement)
          })

          it('should drop the element on unmount', () => {
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

          it('should call a callback with the element, then with null on unmount', () => {
            const seen: (Element | null)[] = []
            const { destroy } = render(() => button({
              ref: (element: HTMLButtonElement | null) => {
                seen.push(element)
              }
            })('Click me!'))

            expect(seen).toHaveLength(1)
            expect(seen[0]).toBeInstanceOf(HTMLButtonElement)

            destroy()

            expect(seen).toEqual([
              expect.any(HTMLButtonElement),
              null
            ])
          })

          it('should take a callback or a signal of the element, its tree or any element', () => {
            const seen: (Element | null)[] = []

            button({
              // an untyped arrow is typed as the element
              ref: element => element?.type
            })
            button({
              ref: element => seen.push(element)
            })
            button({
              ref: (element: HTMLButtonElement | null) => element
            })
            button({
              ref: (element: HTMLElement | null) => element
            })
            button({
              ref: (element: Element | null) => element
            })
            button({
              ref: signal<HTMLButtonElement | null>(null)
            })
            button({
              ref: signal<HTMLElement | null>(null)
            })
            button({
              ref: signal<Element | null>(null)
            })
          })

          it('should reject a signal of a different element', () => {
            const ref = signal<HTMLInputElement | null>(null)

            button({
              // @ts-expect-error the button is not an input
              ref
            })('Click me!')

            input({
              ref
            })
          })

          it('should reject a callback of a different element', () => {
            const ref = (element: HTMLInputElement | null) => element

            button({
              // @ts-expect-error the button is not an input
              ref
            })('Click me!')

            input({
              ref
            })
          })
        })
      })
    })
  })
})
