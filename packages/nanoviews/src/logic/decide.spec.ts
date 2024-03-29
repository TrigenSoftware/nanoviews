import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { atom } from 'nanostores'
import * as Stories from './decide.stories.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('logic', () => {
    describe('decide', () => {
      it('should handle static value', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><b>True</b></div>')
      })

      it('should handle reactive value', () => {
        const value = atom(true)
        const { container } = render(ReactiveValue({
          value
        }))

        expect(container.innerHTML).toBe('<div><b>True</b></div>')

        value.set(false)

        expect(container.innerHTML).toBe('<div>False</div>')
      })
    })
  })
})
