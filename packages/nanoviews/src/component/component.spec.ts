import {
  describe,
  it,
  expect
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
    })
  })
})
