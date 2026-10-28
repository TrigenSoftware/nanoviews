import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import {
  signal,
  inject,
  provide
} from 'kida'
import { context$ } from '../component/context.js'
import { b } from '../elements/elements.js'
import * as Stories from './switch.stories.js'
import {
  switch_,
  case_
} from './switch.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

function Theme$() {
  return signal('light')
}

describe('nanoviews', () => {
  describe('flow', () => {
    describe('switch', () => {
      it('should handle static value', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><b>Loading</b></div>')
      })

      it('should handle reactive value', () => {
        const state = signal<'loading' | 'success' | 'error'>('loading')
        const { container } = render(ReactiveValue({
          state
        }))

        expect(container.innerHTML).toBe('<div><b>Loading</b></div>')

        state('success')

        expect(container.innerHTML).toBe('<div>Success</div>')
      })

      it('should build the case of a static value within the context it is placed in', () => {
        const { container } = render(() => context$(provide(Theme$, signal('dark')))(
          switch_('a')(
            case_('a', () => b()(
              inject(Theme$)
            ))
          )
        ))

        expect(container.innerHTML).toBe('<div><b>dark</b></div>')
      })
    })
  })
})
