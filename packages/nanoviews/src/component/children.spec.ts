import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import * as Stories from './children.stories.js'

const {
  NoSlot,
  Slot,
  Slots,
  ComponentSlots,
  UndeclaredSlot
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('component', () => {
    describe('children', () => {
      it('should render without slot', () => {
        const { container } = render(NoSlot())

        expect(container.innerHTML).toBe('<div><div>Children: Hello!</div></div>')
      })

      it('should render slot', () => {
        const { container } = render(Slot())

        expect(container.innerHTML).toBe('<div><div>Children: Hello! World!</div></div>')
      })

      it('should render slots', () => {
        const { container } = render(Slots())

        expect(container.innerHTML).toBe('<div><div>Hello! World! From Slot!</div></div>')
      })

      it('should render slots of components', () => {
        const { container } = render(ComponentSlots())

        expect(container.innerHTML).toBe(
          '<div><main><header data-testid="header">Header content</header>Main content<footer data-testid="footer">Footer content</footer></main></div>'
        )
      })

      it('should throw on a slot that is not declared', () => {
        expect(() => render(UndeclaredSlot())).toThrow('Slot is not declared in slots$')
      })
    })
  })
})
