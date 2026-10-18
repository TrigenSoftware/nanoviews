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
  LazyElement,
  PolymorphicProps
} from '../internals/types/index.js'
import {
  div,
  a,
  span,
  button,
  article
} from '../elements/index.js'
import {
  component$,
  polymorphic$
} from './component.js'
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

      it('should keep the render bound to a signal prop', () => {
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

    describe('polymorphic$', () => {
      interface ButtonProps extends PolymorphicProps<'button'> {
        variant?: 'primary' | 'secondary'
      }

      const Button = polymorphic$((
        {
          as = button,
          variant = 'primary',
          class: className,
          ...props
        }: ButtonProps,
        children
      ) => as({
        class: ['button', `button_${variant}`, className],
        ...props
      })(
        ...children
      ))
      const Link = component$((
        {
          to,
          ...props
        }: { to: string } & Attributes<'a'>,
        children
      ) => a({
        href: to,
        ...props
      })(
        ...children
      ))

      it('should render the default target without `as`', () => {
        const { container } = render(Button({
          type: 'submit'
        })(
          'Save'
        ))

        expect(container.innerHTML).toBe('<div><button class="button button_primary" type="submit">Save</button></div>')
      })

      it('should render the element given in `as`', () => {
        const { container } = render(Button({
          as: a,
          href: '/docs/'
        })(
          'Docs'
        ))

        expect(container.innerHTML).toBe('<div><a class="button button_primary" href="/docs/">Docs</a></div>')
      })

      it('should render the component given in `as`', () => {
        const { container } = render(Button({
          as: Link,
          to: '/home',
          variant: 'secondary'
        })(
          'Home'
        ))

        expect(container.innerHTML).toBe('<div><a href="/home" class="button button_secondary">Home</a></div>')
      })

      it('should type the props by the target in `as`', () => {
        Button()
        Button({
          as: a,
          href: '/docs/'
        })
        Button({
          as: Link,
          to: '/home'
        })

        Button({
          // @ts-expect-error a button has no `href`
          href: '/docs/'
        })
        // @ts-expect-error the link takes its `to`
        Button({
          as: Link
        })
        Button({
          // @ts-expect-error an own prop keeps its type
          variant: 'tertiary'
        })
      })

      it('should keep the type of an own prop named after an attribute', () => {
        interface BadgeProps extends PolymorphicProps<'span'> {
          color?: 'danger' | 'success'
        }

        const Badge = polymorphic$(({ as = span, color, ...props }: BadgeProps, children) => as({
          class: color,
          ...props
        })(
          ...children
        ))
        const { container } = render(Badge({
          as: a,
          href: '/alerts/',
          color: 'danger'
        })(
          'Alerts'
        ))

        expect(container.innerHTML).toBe('<div><a class="danger" href="/alerts/">Alerts</a></div>')

        Badge({
          // @ts-expect-error the own `color` keeps its type
          color: 'red'
        })
        Badge({
          as: a,
          // @ts-expect-error with any target
          color: 'red'
        })
      })

      it('should take only the targets the props allow', () => {
        const Paper = polymorphic$(({ as = div, ...props }: PolymorphicProps<'div', 'section' | 'article'>, children) => as(props)(...children))
        const { container } = render(Paper({
          as: article
        })(
          'Letter'
        ))

        expect(container.innerHTML).toBe('<div><article>Letter</article></div>')

        Paper()
        Paper({
          // @ts-expect-error a span is not among the targets
          as: span
        })
      })

      it('should require the props when the default target requires some', () => {
        const NavLink = polymorphic$(({ as = Link, ...props }: PolymorphicProps<typeof Link>, children) => as(props)(...children))

        NavLink({
          to: '/home'
        })

        // @ts-expect-error the default link takes its `to`
        NavLink()
      })

      it('should take no children when the render has no children parameter', () => {
        const Divider = polymorphic$(({ as = span, ...props }: PolymorphicProps<'span'>) => as(props)('—'))

        // @ts-expect-error a component that takes no children is not called with them
        Divider()('Hello')
      })
    })
  })
})
