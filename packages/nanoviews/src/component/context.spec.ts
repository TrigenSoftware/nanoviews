import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import {
  InjectionContext,
  inject,
  provide,
  signal
} from 'kida'
import { div } from '../elements/index.js'
import { component$ } from './component.js'
import { context$ } from './context.js'
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

      it('should inherit from the parent of a given context instance rather than the current context', () => {
        const Theme$ = () => 'light'
        const User$ = () => 'Guest'
        const ThemeAndUser = component$(() => div()('Theme: ', inject(Theme$), ' User: ', inject(User$)))
        const context = new InjectionContext([
          provide(User$, 'Admin')
        ], new InjectionContext([
          provide(Theme$, 'blue')
        ]))
        const { container } = render(() => context$(provide(Theme$, 'dark'))(
          context$(context)(ThemeAndUser())
        ))

        expect(container.innerHTML).toBe('<div><div>Theme: blue User: Admin</div></div>')
      })

      it('should resolve dependencies into a given context instance', () => {
        const Count$ = () => signal(0)
        const Count = component$(() => div()(inject(Count$)))
        const context = new InjectionContext()
        const { container } = render(() => context$(context)(Count()))

        inject(Count$, context)(1)

        expect(container.innerHTML).toBe('<div><div>1</div></div>')
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
