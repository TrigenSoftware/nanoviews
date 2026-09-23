import {
  describe,
  it,
  expect,
  expectTypeOf
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import {
  render,
  screen,
  fireEvent
} from '@nanoviews/testing-library'
import { signal } from 'kida'
import type {
  Attributes,
  Child,
  Component,
  LazyElement
} from '../internals/types/index.js'
import { div } from '../elements/index.js'
import { component$ } from './component.js'
import * as Stories from './component.stories.js'

const {
  WithChildren,
  WithoutChildren,
  Props,
  NoProps,
  ProvidedThroughChildren,
  TypedChildren
} = composeStories(Stories)

describe('nanoviews', () => {
  describe('component', () => {
    describe('component$', () => {
      it('should render props and children', () => {
        const { container } = render(WithChildren())

        expect(container.innerHTML).toBe('<div><div class="card">Hello, <b>world</b></div></div>')
      })

      it('should render with an empty children list when used without the children call', () => {
        const { container } = render(WithoutChildren())

        expect(container.innerHTML).toBe('<div><div><div class="card">empty</div></div></div>')
      })

      it('should read props through props$', () => {
        const name = signal('world')
        const { container } = render(Props({
          name
        }))

        expect(container.innerHTML).toBe('<div><p id="greeting">Hello, world!</p></div>')

        name('nanoviews')

        expect(container.innerHTML).toBe('<div><p id="greeting">Hello, nanoviews!</p></div>')
      })

      it('should render without props', () => {
        const { container } = render(NoProps())

        expect(container.innerHTML).toBe('<div><button>Count: 0</button></div>')

        fireEvent.click(screen.getByRole('button'))

        expect(container.innerHTML).toBe('<div><button>Count: 1</button></div>')
      })

      it('should provide context to the children through context$', () => {
        render(ProvidedThroughChildren())

        const [signals, log] = screen.getAllByRole('tab')

        expect(signals.getAttribute('aria-selected')).toBe('true')
        expect(log.getAttribute('aria-selected')).toBe('false')

        fireEvent.click(log)

        expect(signals.getAttribute('aria-selected')).toBe('false')
        expect(log.getAttribute('aria-selected')).toBe('true')
      })

      it('should type the children', () => {
        const { container } = render(TypedChildren())

        expect(container.innerHTML).toBe(
          '<div><ul><li><b>Player: chopper</b></li><li><b>Player: magixx</b></li><li><b>Player: donk</b></li></ul></div>'
        )
      })

      it('should render when the instance is called without arguments', () => {
        const Box = component$<Attributes<'div'>>((props, children) => div(props)(...children))
        const rendered = Box({
          class: 'box'
        })('Hello')() as LazyElement<HTMLDivElement>

        expect(rendered().outerHTML).toBe('<div class="box">Hello</div>')
      })

      it('should take no children when the render has no children parameter', () => {
        const NoParameters = component$(() => div()('Hello'))
        const PropsOnly = component$((props: Attributes<'div'>) => div(props)('Hello'))

        expectTypeOf(NoParameters).toEqualTypeOf<Component<object, []>>()
        expectTypeOf(PropsOnly).toEqualTypeOf<Component<Attributes<'div'>, []>>()

        // @ts-expect-error a component that takes no children is not called with them
        NoParameters()('Hello')
      })

      it('should take children when the render has the children parameter', () => {
        const Untyped = component$((_, children) => div()(...children))
        const Typed = component$((props: Attributes<'div'>, [item]: [item: (index: number) => Child]) => div(props)(item(0)))

        expectTypeOf(Untyped).toEqualTypeOf<Component<object>>()
        expectTypeOf(Typed).toEqualTypeOf<Component<Attributes<'div'>, [item: (index: number) => Child]>>()
      })

      it('should keep the declared children when the type arguments are written out', () => {
        const Declared = component$<Attributes<'div'>>(props => div(props)('Hello'))
        const DeclaredNone = component$<Attributes<'div'>, []>(props => div(props)('Hello'))

        expectTypeOf(Declared).toEqualTypeOf<Component<Attributes<'div'>>>()
        expectTypeOf(DeclaredNone).toEqualTypeOf<Component<Attributes<'div'>, []>>()
      })
    })
  })
})
