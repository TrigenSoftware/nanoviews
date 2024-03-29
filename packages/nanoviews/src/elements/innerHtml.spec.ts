import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { atom } from 'nanostores'
import * as Stories from './innerHtml.stories.js'

const {
  StaticValue,
  ReactiveValue
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('elements', () => {
    describe('innerHtml', () => {
      it('should render static markup', () => {
        const { container } = render(StaticValue())

        expect(container.innerHTML).toBe('<div><div><p>Hello, world!</p></div></div>')
      })

      it('should render reactive markup', () => {
        const html = atom('<p>Hello, world!</p>')
        const { container } = render(ReactiveValue({
          html
        }))

        expect(container.innerHTML).toBe('<div><div><p>Hello, world!</p></div></div>')

        html.set('<p>Hello, <b>nanoviews</b>!</p>')

        expect(container.innerHTML).toBe('<div><div><p>Hello, <b>nanoviews</b>!</p></div></div>')
      })
    })
  })
})
