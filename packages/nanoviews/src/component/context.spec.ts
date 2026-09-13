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
  FewContexts,
  NestedContext,
  IsolatedContext
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('component', () => {
    describe('context$', () => {
      it('should render default value', () => {
        const { container } = render(DefaultValue())

        expect(container.innerHTML).toBe('<div><div>Theme: light</div></div>')
      })

      it('should render one context', () => {
        const { container } = render(OneContext())

        expect(container.innerHTML).toBe('<div><div>Theme: dark</div></div>')
      })

      it('should render few contexts', () => {
        const { container } = render(FewContexts())

        expect(container.innerHTML).toBe('<div><div>Theme: dark User: Admin</div></div>')
      })

      it('should override a value in a nested context', () => {
        const { container } = render(NestedContext())

        expect(container.innerHTML).toBe('<div><div><div>Theme: dark</div><div>Theme: blue</div></div></div>')
      })
    })

    describe('isolate$', () => {
      it('should hide the providers above', () => {
        const { container } = render(IsolatedContext())

        expect(container.innerHTML).toBe('<div><div><div>Theme: dark</div><div>Theme: light User: Admin</div></div></div>')
      })
    })
  })
})
