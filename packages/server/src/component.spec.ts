import {
  describe,
  it,
  expect
} from 'vitest'
import {
  InjectionContext,
  inject,
  provide,
  signal
} from 'kida'
import type { PolymorphicProps } from 'nanoviews'
import {
  a,
  button,
  div,
  header,
  main,
  p
} from './elements/elements.js'
import { renderToString } from './renderToString.js'
import {
  component$,
  context$,
  effect$,
  isolate$,
  polymorphic$,
  slot$,
  slots$
} from './component.js'

function Theme$() {
  return signal('light')
}

const Theme = component$(() => {
  const $theme = inject(Theme$)

  return p()(
    $theme
  )
})

describe('server', () => {
  describe('component', () => {
    describe('context$', () => {
      it('should provide dependencies to the child', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          Theme()
        ))).toBe('<p>dark</p>')
      })

      it('should keep the context of the caller without providers', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          context$()(
            Theme()
          )
        ))).toBe('<p>dark</p>')
      })

      it('should open a context for the factories', () => {
        expect(renderToString(() => context$()(
          Theme()
        ))).toBe('<p>light</p>')
      })

      it('should build the child within the given context', () => {
        const context = new InjectionContext([provide(Theme$, signal('blue'))])

        expect(renderToString(() => context$(context)(
          Theme()
        ))).toBe('<p>blue</p>')
      })

      it('should give every render a context of its own', () => {
        const App = component$(() => {
          const $theme = inject(Theme$)

          $theme('dark')

          return p()(
            $theme
          )
        })

        expect(renderToString(() => context$()(
          App()
        ))).toBe('<p>dark</p>')
        expect(renderToString(() => context$()(
          Theme()
        ))).toBe('<p>light</p>')
      })
    })

    describe('isolate$', () => {
      it('should build the child without a context', () => {
        expect(() => renderToString(() => context$()(
          isolate$(
            Theme()
          )
        ))).toThrow('Cannot inject dependency outside of injection context')
      })
    })

    describe('effect$', () => {
      it('should not run the effect', () => {
        let runs = 0

        effect$(() => {
          runs++
        })

        expect(runs).toBe(0)
      })
    })

    describe('slots$', () => {
      it('should place the slots', () => {
        const Header = slot$((_, children) => header()(
          ...children
        ))
        const Layout = component$(slots$([Header], (_, headerSlot, children) => div()(
          headerSlot,
          main()(
            ...children
          )
        )))

        expect(renderToString(() => Layout()(
          'Content',
          Header()(
            'Title'
          )
        ))).toBe('<div><header>Title</header><main>Content</main></div>')
      })
    })

    describe('polymorphic$', () => {
      it('should render the target given in as', () => {
        const Action = polymorphic$(({
          as = button,
          ...props
        }: PolymorphicProps<'button'>, children) => as(props)(
          ...children
        ))

        expect(renderToString(() => Action({
          as: a,
          href: '/'
        })(
          'Home'
        ))).toBe('<a href="/">Home</a>')
      })
    })
  })
})
