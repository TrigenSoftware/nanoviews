import {
  describe,
  it,
  expect
} from 'vitest'
import { render } from '@nanoviews/testing-library'
import { signal } from 'kida'
import { createElement } from '../elements/index.js'
import {
  provide,
  context,
  inject
} from './context.js'
import { decide } from './decide.js'

describe('nanoviews', () => {
  describe('internals', () => {
    describe('logic', () => {
      describe('decide', () => {
        it('should save context', () => {
          const $value = signal(true)
          const ThemeContext = () => 'light'
          const ComponentA = () => createElement('div')('(A) ', inject(ThemeContext))
          const ComponentB = () => createElement('div')('(B) ', inject(ThemeContext))
          const Swapper = () => context(
            [provide(ThemeContext, 'dark')],
            () => decide($value, value => (value ? ComponentA() : ComponentB()))
          )
          const { container } = render(Swapper)

          expect(container.innerHTML).toBe('<div><div>(A) dark</div></div>')

          $value.set(false)

          expect(container.innerHTML).toBe('<div><div>(B) dark</div></div>')

          $value.set(true)

          expect(container.innerHTML).toBe('<div><div>(A) dark</div></div>')
        })
      })
    })
  })
})
