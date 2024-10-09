import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  render,
  cleanup
} from '@nanoviews/testing-library'
import type { Store } from '@nanoviews/stores'
import {
  atom,
  isStore
} from '@nanoviews/stores'
import {
  h1,
  div
} from './elements/index.js'
import {
  component$,
  effect$,
  deps$,
  children$,
  slots$,
  createSlot,
  computed$
} from './component.js'

describe('nanoviews', () => {
  describe('component', () => {
    describe('component$', () => {
      it('should create component', () => {
        const Comp = component$(() => h1()('Hello, world!'))
        const { container } = render(Comp())

        expect(container.innerHTML).toBe('<div><h1>Hello, world!</h1></div>')
      })

      it('should create component with props', () => {
        interface Props {
          text?: string | Store<string>
        }

        const Comp = component$(({ text = 'default' }: Props) => div()('Text: ', text))
        let container = render(Comp()).container

        expect(container.innerHTML).toBe('<div><div>Text: default</div></div>')

        cleanup()
        container = render(Comp({})).container

        expect(container.innerHTML).toBe('<div><div>Text: default</div></div>')

        cleanup()
        container = render(Comp({
          text: 'custom'
        })).container

        expect(container.innerHTML).toBe('<div><div>Text: custom</div></div>')

        const $text = atom('Hello, world!')

        cleanup()
        container = render(Comp({
          text: $text
        })).container

        expect(container.innerHTML).toBe('<div><div>Text: Hello, world!</div></div>')

        $text.set('Hello, nanoviews!')

        expect(container.innerHTML).toBe('<div><div>Text: Hello, nanoviews!</div></div>')
      })
    })

    describe('effect$', () => {
      it('should add mount effect', () => {
        const destroyFn = vi.fn()
        const effectFn = vi.fn(() => destroyFn)
        const Comp = component$(() => {
          effect$(effectFn)

          return h1()('Hello, world!')
        })
        const cmp = Comp()

        expect(effectFn).toHaveBeenCalledTimes(0)
        expect(destroyFn).toHaveBeenCalledTimes(0)

        const {
          container,
          block,
          destroy
        } = render(cmp)

        expect(container.innerHTML).toBe('<div><h1>Hello, world!</h1></div>')
        expect(effectFn).toHaveBeenCalledTimes(1)
        expect(destroyFn).toHaveBeenCalledTimes(0)
        expect(effectFn).toHaveBeenCalledWith(block.n())

        destroy()

        expect(destroyFn).toHaveBeenCalledTimes(1)
      })
    })

    describe('deps$', () => {
      it('should add deps effect with single dep', () => {
        const destroyFn = vi.fn()
        const effectFn = vi.fn(() => destroyFn)
        const $text = atom('foo')
        const Comp = component$(() => {
          effect$(deps$($text, effectFn))

          return h1()('Hello, world!')
        })
        const cmp = Comp()

        expect(effectFn).toHaveBeenCalledTimes(0)
        expect(destroyFn).toHaveBeenCalledTimes(0)

        const {
          container,
          block,
          destroy
        } = render(cmp)

        expect(container.innerHTML).toBe('<div><h1>Hello, world!</h1></div>')
        expect(effectFn).toHaveBeenCalledTimes(1)
        expect(destroyFn).toHaveBeenCalledTimes(0)
        expect(effectFn).toHaveBeenCalledWith(block.n(), 'foo', undefined)

        $text.set('bar')

        expect(effectFn).toHaveBeenCalledTimes(2)
        expect(destroyFn).toHaveBeenCalledTimes(1)
        expect(effectFn).toHaveBeenCalledWith(block.n(), 'bar', 'foo')

        destroy()

        expect(effectFn).toHaveBeenCalledTimes(2)
        expect(destroyFn).toHaveBeenCalledTimes(2)
      })

      it('should add deps effect with few deps', () => {
        const destroyFn = vi.fn()
        const effectFn = vi.fn(() => destroyFn)
        const $text = atom('foo')
        const $num = atom(0)
        const Comp = component$(() => {
          effect$(deps$([$text, $num], effectFn))

          return h1()('Hello, world!')
        })
        const cmp = Comp()

        expect(effectFn).toHaveBeenCalledTimes(0)
        expect(destroyFn).toHaveBeenCalledTimes(0)

        const {
          container,
          block,
          destroy
        } = render(cmp)

        expect(container.innerHTML).toBe('<div><h1>Hello, world!</h1></div>')
        expect(effectFn).toHaveBeenCalledTimes(1)
        expect(destroyFn).toHaveBeenCalledTimes(0)
        expect(effectFn).toHaveBeenCalledWith(block.n(), 'foo', 0, undefined, undefined)

        $text.set('bar')

        expect(effectFn).toHaveBeenCalledTimes(2)
        expect(destroyFn).toHaveBeenCalledTimes(1)
        expect(effectFn).toHaveBeenCalledWith(block.n(), 'bar', 0, 'foo', 0)

        $num.set(1)

        expect(effectFn).toHaveBeenCalledTimes(3)
        expect(destroyFn).toHaveBeenCalledTimes(2)
        expect(effectFn).toHaveBeenCalledWith(block.n(), 'bar', 1, 'bar', 0)

        destroy()

        expect(effectFn).toHaveBeenCalledTimes(3)
        expect(destroyFn).toHaveBeenCalledTimes(3)
      })
    })

    describe('children$', () => {
      it('should render without children', () => {
        const Comp = component$(children$((_, children) => div()(children)))
        const { container } = render(Comp())

        expect(container.innerHTML).toBe('<div><div></div></div>')
      })

      it('should render with children', () => {
        const Comp = component$(children$((_, children) => div()(children)))
        const { container } = render(Comp()(h1()('Hello, world!')))

        expect(container.innerHTML).toBe('<div><div><h1>Hello, world!</h1></div></div>')
      })
    })

    describe('slots$', () => {
      const TestSlot = createSlot<string>()

      it('should render without children', () => {
        const Comp = component$(slots$([TestSlot], (_, testChild, children) => div()(
          children,
          ' | ',
          testChild
        )))
        const { container } = render(Comp())

        expect(container.innerHTML).toBe('<div><div> | </div></div>')
      })

      it('should render with slot', () => {
        const Comp = component$(slots$([TestSlot], (_, testChild, children) => div()(
          children,
          ' | ',
          testChild
        )))
        const { container } = render(Comp()(
          TestSlot('Slot!'),
          'Child!'
        ))

        expect(container.innerHTML).toBe('<div><div>Child! | Slot!</div></div>')
      })
    })

    describe('computed$', () => {
      it('should accept static values', () => {
        const val = computed$([1, 2], (a, b) => a + b)

        expect(val).toBe(3)
      })

      it('should accept mixed values', () => {
        const val = computed$([1, atom(2)], (a, b) => a + b)

        expect(val).toSatisfy(isStore)
        expect(val.get()).toBe(3)
      })

      it('should accept store values', () => {
        const val = computed$([atom(1), atom(2)], (a, b) => a + b)

        expect(val).toSatisfy(isStore)
        expect(val.get()).toBe(3)
      })
    })
  })
})
