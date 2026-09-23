import {
  describe,
  it,
  expect,
  expectTypeOf
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import type {
  Attributes,
  SlotComponent
} from '../internals/types/index.js'
import { header } from '../elements/index.js'
import { slot$ } from './slots.js'
import * as Stories from './slots.stories.js'

const {
  NoSlot,
  Slot,
  Slots,
  ComponentSlots,
  UncalledSlot,
  UndeclaredSlot,
  StandaloneSlot,
  SlotThroughContext
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('component', () => {
    describe('slots', () => {
      describe('getSlots', () => {
        it('should render without slot', () => {
          const { container } = render(NoSlot())

          expect(container.innerHTML).toBe('<div><div>Children: Hello!</div></div>')
        })

        it('should render slot', () => {
          const { container } = render(Slot())

          expect(container.innerHTML).toBe('<div><div>Children: Hello! <b>World!</b></div></div>')
        })

        it('should render slots in declaration order', () => {
          const { container } = render(Slots())

          expect(container.innerHTML).toBe('<div><div><b>Hello! </b>World! <b>From Slot!</b></div></div>')
        })
      })

      describe('slots$', () => {
        it('should render slots of components', () => {
          const { container } = render(ComponentSlots())

          expect(container.innerHTML).toBe(
            '<div><main class="page"><header data-testid="header">Header content</header>Main content<footer data-testid="footer">Footer content</footer></main></div>'
          )
        })

        it('should take a slot without the children call', () => {
          const { container } = render(UncalledSlot())

          expect(container.innerHTML).toBe('<div><main><header data-testid="header"></header>Main content</main></div>')
        })

        it('should throw on a slot that is not declared', () => {
          expect(() => render(UndeclaredSlot())).toThrow('Slot is not declared in slots$')
        })

        it('should provide context to a slot', () => {
          const { container } = render(SlotThroughContext())

          expect(container.innerHTML).toBe('<div><div role="dialog">Edit<button>Save draft</button></div></div>')
        })
      })

      describe('slot$', () => {
        it('should render a slot on its own', () => {
          const { container } = render(StandaloneSlot())

          expect(container.innerHTML).toBe('<div><div><header class="alone">Alone</header></div></div>')
        })

        it('should take no children when the render has no children parameter', () => {
          const Title = slot$((props: Attributes<'header'>) => header(props)('Title'))

          expectTypeOf(Title).toEqualTypeOf<SlotComponent<Attributes<'header'>, []>>()

          // @ts-expect-error a slot that takes no children is not called with them
          Title()('Hello')
        })

        it('should take children when the render has the children parameter', () => {
          const Title = slot$((props: Attributes<'header'>, children) => header(props)(...children))

          expectTypeOf(Title).toEqualTypeOf<SlotComponent<Attributes<'header'>>>()
        })
      })
    })
  })
})
