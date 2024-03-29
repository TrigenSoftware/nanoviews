import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import * as Stories from './portal.stories.js'

const { Default } = composeStories(Stories)

describe('nanoviews', () => {
  describe('logic', () => {
    describe('portal', () => {
      it('should portal block to target', () => {
        render(Default())

        expect(document.body.innerHTML).toBe('<div></div><div>I wanna be in the body!</div>')
      })
    })
  })
})
