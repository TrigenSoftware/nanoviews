import {
  describe,
  it,
  expect,
  vi
} from 'vitest'
import { render } from '@nanoviews/testing-library'
import { signal } from 'kida'
import { createElement } from '../elements/index.js'
import {
  provide,
  context,
  inject
} from '../../component/context.js'
import { decide } from './decide.js'

describe('nanoviews', () => {
  describe('internals', () => {
    describe('logic', () => {
      describe('decide', () => {
        it('should save context', () => {
          const $value = signal(true)
          const ThemeContext = () => 'light'
          const ComponentA = vi.fn(() => createElement('div')('(A) ', inject(ThemeContext)))
          const ComponentB = vi.fn(() => createElement('div')('(B) ', inject(ThemeContext)))
          const decider = vi.fn(value => (value ? ComponentA() : ComponentB()))
          const Swapper = () => context(
            [provide(ThemeContext, 'dark')],
            () => decide($value, decider)
          )
          const { container } = render(Swapper)

          expect(ComponentA).toHaveBeenCalledTimes(1)
          expect(ComponentB).toHaveBeenCalledTimes(0)
          expect(decider).toHaveBeenCalledTimes(1)
          expect(container.innerHTML).toBe('<div><div>(A) dark</div></div>')

          $value(false)

          expect(ComponentA).toHaveBeenCalledTimes(1)
          expect(ComponentB).toHaveBeenCalledTimes(1)
          expect(decider).toHaveBeenCalledTimes(2)
          expect(container.innerHTML).toBe('<div><div>(B) dark</div></div>')

          $value(true)

          expect(ComponentA).toHaveBeenCalledTimes(2)
          expect(ComponentB).toHaveBeenCalledTimes(1)
          expect(decider).toHaveBeenCalledTimes(3)
          expect(container.innerHTML).toBe('<div><div>(A) dark</div></div>')
        })
      })
    })
  })
})
