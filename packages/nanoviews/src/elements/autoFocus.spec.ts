import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import {
  render,
  screen
} from '@nanoviews/testing-library'
import * as Stories from './autoFocus.stories.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('autoFocus$', () => {
      it('should focus element by static value', () => {
        render(StaticValue())

        const input = screen.getByRole('textbox')

        expect(input.ownerDocument.activeElement).toBe(input)
      })

      it('should focus element by reactive value', () => {
        render(ReactiveValue())

        const input = screen.getByRole('textbox')

        expect(input.ownerDocument.activeElement).toBe(input)
      })
    })
  })
})
