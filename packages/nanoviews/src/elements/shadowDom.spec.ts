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
import * as Stories from './shadowDom.stories.js'

const { Default } = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('shadowDom', () => {
      it('should attach shadow dom', () => {
        const { container } = render(Default())

        expect(container.innerHTML).toBe('<div><div data-testid="shadow-root"></div></div>')

        const shadowRoot = screen.getByTestId('shadow-root').shadowRoot

        expect(shadowRoot!.innerHTML).toBe('Nanoviews can shadow DOM!')
      })
    })
  })
})
