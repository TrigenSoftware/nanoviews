import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { signal } from 'kida'
import {
  svg,
  path
} from '../svg/index.js'
import * as Stories from './classList.stories.js'
import { classList$ } from './classList.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('classList$', () => {
      it('should render static class list', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><div class="class1 class3">Hello, world!</div></div>')
      })

      it('should render reactive class list', () => {
        const primary = signal(true)
        const rounded = signal(false)
        const { container } = render(ReactiveValue({
          primary,
          rounded
        }))

        expect(container.innerHTML).toBe('<div><button class="button primary">Hello, world!</button></div>')

        primary(false)

        expect(container.innerHTML).toBe('<div><button class="button regular">Hello, world!</button></div>')

        rounded(true)

        expect(container.innerHTML).toBe('<div><button class="button regular rounded">Hello, world!</button></div>')

        primary(true)

        expect(container.innerHTML).toBe('<div><button class="button primary rounded">Hello, world!</button></div>')
      })

      it('should render partially reactive class list', () => {
        const primary = signal(true)
        const { container } = render(ReactiveValue({
          primary,
          rounded: true
        }))

        expect(container.innerHTML).toBe('<div><button class="button primary rounded">Hello, world!</button></div>')

        primary(false)

        expect(container.innerHTML).toBe('<div><button class="button regular rounded">Hello, world!</button></div>')

        primary(true)

        expect(container.innerHTML).toBe('<div><button class="button primary rounded">Hello, world!</button></div>')
      })

      it('should render reactive class list on SVG element', () => {
        // A browser exposes `className` of an SVG element as a read-only
        // `SVGAnimatedString`, and assigning it throws; happy-dom lets it be
        // assigned, so the test takes the setter away
        Object.defineProperty(SVGElement.prototype, 'className', {
          configurable: true,
          get(this: SVGElement) {
            return {
              baseVal: this.getAttribute('class') ?? ''
            }
          }
        })

        try {
          const active = signal(true)
          const { container } = render(() => svg()(
            path({
              [classList$]: [
                'icon',
                () => active() && 'icon_active'
              ]
            })
          ))
          const icon = container.querySelector('path')!

          expect(icon.getAttribute('class')).toBe('icon icon_active')

          active(false)

          expect(icon.getAttribute('class')).toBe('icon')
        } finally {
          Reflect.deleteProperty(SVGElement.prototype, 'className')
        }
      })
    })
  })
})
