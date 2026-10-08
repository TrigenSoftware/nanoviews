import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { fragment } from './fragment.js'
import { portal } from './portal.js'
import * as Stories from './portal.stories.js'

const { Default } = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('portal', () => {
      it('should portal block to target', () => {
        render(Default())

        expect(document.body.innerHTML).toBe('<div></div><div>I wanna be in the body!</div>')
      })

      it('should unmount a fragment whose children render nothing', () => {
        const sink = document.createElement('section')
        const { destroy } = render(() => portal(
          () => sink,
          fragment(
            null
          )
        ))

        expect(destroy).not.toThrow()
        expect(sink.innerHTML).toBe('')
      })
    })
  })
})
