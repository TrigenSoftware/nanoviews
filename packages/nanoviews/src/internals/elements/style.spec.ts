import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { signal } from 'kida'
import { div } from '../../elements/elements.js'
import * as Stories from './style.stories.js'

const {
  StaticValue,
  ReactiveValue,
  MultiWordValue,
  CustomProperty
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('internals', () => {
    describe('elements', () => {
      describe('style', () => {
        it('should render static value', () => {
          const { container } = render(StaticValue())

          expect(container.innerHTML).toBe('<div><div style="color: green;">Hello, world!</div></div>')
        })

        it('should render reactive value', () => {
          const color = signal('green')
          const { container } = render(ReactiveValue({
            color
          }))

          expect(container.innerHTML).toBe('<div><div style="color: green;">Hello, world!</div></div>')

          color('red')

          expect(container.innerHTML).toBe('<div><div style="color: red;">Hello, world!</div></div>')
        })

        it('should render custom properties', () => {
          const color = signal('green')
          const { container } = render(CustomProperty({
            color
          }))

          expect(container.innerHTML).toBe('<div><div style="--accent: green; --gap: 4px;">Hello, world!</div></div>')

          color('red')

          expect(container.innerHTML).toBe('<div><div style="--accent: red; --gap: 4px;">Hello, world!</div></div>')
        })

        it('should render multi-word properties', () => {
          const color = signal('green')
          const { container } = render(MultiWordValue({
            color
          }))

          expect(container.innerHTML).toBe('<div><div style="background-color: green; font-size: 12px;">Hello, world!</div></div>')

          color('red')

          expect(container.innerHTML).toBe('<div><div style="background-color: red; font-size: 12px;">Hello, world!</div></div>')
        })

        it('should keep a style string an attribute', () => {
          const $style = signal('color: green;')
          const { container } = render(() => div()(
            div({
              style: 'color: red;'
            })('Static'),
            div({
              style: $style
            })('Reactive')
          ))

          expect(container.innerHTML).toBe('<div><div><div style="color: red;">Static</div><div style="color: green;">Reactive</div></div></div>')

          $style('color: blue;')

          expect(container.innerHTML).toBe('<div><div><div style="color: red;">Static</div><div style="color: blue;">Reactive</div></div></div>')
        })
      })
    })
  })
})
