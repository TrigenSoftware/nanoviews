import {
  describe,
  it,
  expect,
  expectTypeOf
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import {
  type Accessor,
  type Signalish,
  signal
} from 'kida'
import type {
  Attributes,
  ClassValue
} from '../types/index.js'
import {
  svg,
  path
} from '../../svg/index.js'
import { props$ } from '../../component/props.js'
import { component$ } from '../../component/component.js'
import { div } from '../../elements/elements.js'
import { classList } from '../../elements/classList.js'
import * as Stories from './classList.stories.js'
import { cx } from './classList.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('internals', () => {
    describe('elements', () => {
      describe('classList', () => {
        describe('cx', () => {
          it('should join the truthy string parts into a string', () => {
            expect(cx(['button', false, null, 'button_primary', ''])).toBe('button button_primary')
          })

          it('should follow accessor parts', () => {
            const primary = signal(true)
            const $class = cx(['button', () => primary() && 'button_primary']) as Accessor<string>

            expect($class()).toBe('button button_primary')

            primary(false)

            expect($class()).toBe('button')
          })

          it('should give an empty class for an empty list', () => {
            expect(cx([])).toBe('')
          })

          it('should join nested lists in place', () => {
            const $class = cx(['card', ['card_wide', false], () => ['card_dark']]) as Accessor<string>

            expect($class()).toBe('card card_wide card_dark')
            expect(cx(['card', ['card_wide', ['card_dark']]])).toBe('card card_wide card_dark')
          })
        })

        describe('class attribute', () => {
          it('should render static class list', () => {
            const { container } = render(StaticValue())

            expect(container.innerHTML).toBe('<div><div class="class1 class3">Hello, world!</div></div>')
          })

          it('should join a list with no accessors once, without an effect', () => {
            // built by hand, outside a scope: an effect would have nowhere to
            // live and would throw
            const element = div({
              class: ['card', false, ['card_wide', null, ['card_dark']]]
            })()

            expect(element.className).toBe('card card_wide card_dark')
          })

          it('should follow an accessor deep in a nested list', () => {
            const $dark = signal(false)
            const { container } = render(() => div({
              class: ['card', ['card_wide', [() => $dark() && 'card_dark']]]
            })())
            const element = container.querySelector('.card')!

            expect(element.className).toBe('card card_wide')

            $dark(true)

            expect(element.className).toBe('card card_wide card_dark')
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
            const active = signal(true)
            const { container } = render(() => svg()(
              path({
                class: [
                  'icon',
                  () => active() && 'icon_active'
                ]
              })
            ))
            const icon = container.querySelector('path')!

            expect(icon.getAttribute('class')).toBe('icon icon_active')

            active(false)

            expect(icon.getAttribute('class')).toBe('icon')
          })

          it('should fold the class a component received into its own', () => {
            const Card = component$((props: Attributes<'div'>) => {
              const {
                $class,
                ...restProps
              } = props$(props)

              return div({
                ...restProps,
                class: [
                  'card',
                  $class
                ]
              })('Card')
            })
            const dark = signal(false)
            const { container } = render(() => Card({
              class: [
                'card_wide',
                () => dark() && 'card_dark'
              ]
            }))

            expect(container.innerHTML).toBe('<div><div class="card card_wide">Card</div></div>')

            dark(true)

            expect(container.innerHTML).toBe('<div><div class="card card_wide card_dark">Card</div></div>')
          })

          it('should type and return a string, an accessor or either', () => {
            const primary = signal(true)
            const parts: ClassValue[] = ['button']

            expectTypeOf(classList('button', false)).toEqualTypeOf<string>()
            expectTypeOf(classList('button', primary)).toEqualTypeOf<Accessor<string>>()
            expectTypeOf(classList('button', parts)).toEqualTypeOf<Signalish<string>>()
            expect(classList('button', false, 'button_primary')).toBe('button button_primary')
            expect(classList('button', () => primary() && 'button_primary')()).toBe('button button_primary')
          })

          it('should take a class list accessor', () => {
            const primary = signal(true)
            const { container } = render(() => div({
              class: classList('button', () => primary() && 'button_primary')
            })())

            expect(container.innerHTML).toBe('<div><div class="button button_primary"></div></div>')

            primary(false)

            expect(container.innerHTML).toBe('<div><div class="button"></div></div>')
          })
        })
      })
    })
  })
})
