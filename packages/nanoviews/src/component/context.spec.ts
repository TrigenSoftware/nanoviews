import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import * as Stories from './context.stories.js'

const {
  DefaultValue,
  OneContext,
  FewContexts
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('component', () => {
    describe('context', () => {
      it('should render default value', () => {
        const { container } = render(DefaultValue())

        expect(container.innerHTML).toBe('<div><div>Default theme: light</div></div>')
      })

      it('should render one context', () => {
        const { container } = render(OneContext())

        expect(container.innerHTML).toBe('<div><div>Theme: dark</div></div>')
      })

      it('should render few contexts', () => {
        const { container } = render(FewContexts())

        expect(container.innerHTML).toBe('<div><div>Theme: dark User: Admin</div></div>')
      })
    })
  })
})
