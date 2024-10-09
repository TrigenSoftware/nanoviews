import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { atom } from '@nanoviews/stores'
import * as Stories from './switch.stories.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('logic', () => {
    describe('switch', () => {
      it('should handle static value', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><b>Loading</b></div>')
      })

      it('should handle reactive value', () => {
        const state = atom<'loading' | 'success' | 'error'>('loading')
        const { container } = render(ReactiveValue({
          state
        }))

        expect(container.innerHTML).toBe('<div><b>Loading</b></div>')

        state.set('success')

        expect(container.innerHTML).toBe('<div>Success</div>')
      })
    })
  })
})
