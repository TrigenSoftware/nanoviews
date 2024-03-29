import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { render } from '@nanoviews/testing-library'
import type { GetChildHook } from '../types/index.js'
import { createElement } from '../elements/index.js'
import {
  createContext,
  provideContext
} from './context.js'
import {
  swap,
  createSwapper
} from './swap.js'

describe('nanoviews', () => {
  describe('internals', () => {
    describe('logic', () => {
      describe('swap', () => {
        describe('swap', () => {
          it('should swap two elements', () => {
            const a = createElement('div')('A')
            const b = createElement('div')('B')
            const { container } = render(a)

            expect(container.innerHTML).toBe('<div><div>A</div></div>')

            swap(a, b)

            expect(container.innerHTML).toBe('<div><div>B</div></div>')

            swap(b, a)

            expect(container.innerHTML).toBe('<div><div>A</div></div>')
          })

          it('should only insert element before', () => {
            const a = createElement('div')('A')
            const b = createElement('div')('B')
            const { container } = render(a)

            expect(container.innerHTML).toBe('<div><div>A</div></div>')

            swap(a, b, -1)

            expect(container.innerHTML).toBe('<div><div>B</div><div>A</div></div>')
          })

          it('should only insert element after', () => {
            const a = createElement('div')('A')
            const b = createElement('div')('B')
            const { container } = render(a)

            expect(container.innerHTML).toBe('<div><div>A</div></div>')

            swap(a, b, 1)

            expect(container.innerHTML).toBe('<div><div>A</div><div>B</div></div>')
          })
        })

        describe('createSwapper', () => {
          it('should render without initial value', () => {
            let setBlock: GetChildHook
            const swapper = createSwapper(null, (sb) => {
              setBlock = sb
            })
            const { container } = render(swapper)

            expect(container.innerHTML).toBe('<div></div>')

            setBlock!(() => createElement('div')('A'))

            expect(container.innerHTML).toBe('<div><div>A</div></div>')

            setBlock!(() => createElement('div')('B'))

            expect(container.innerHTML).toBe('<div><div>B</div></div>')

            setBlock!(() => null)

            expect(container.innerHTML).toBe('<div></div>')
          })

          it('should render with initial value', () => {
            let setBlock: GetChildHook
            const swapper = createSwapper(createElement('div')('A'), (sb) => {
              setBlock = sb
            })
            const { container } = render(swapper)

            expect(container.innerHTML).toBe('<div><div>A</div></div>')

            setBlock!(() => createElement('div')('B'))

            expect(container.innerHTML).toBe('<div><div>B</div></div>')

            setBlock!(() => null)

            expect(container.innerHTML).toBe('<div></div>')
          })

          it('should call destroy function', () => {
            const destroy = vi.fn()
            const swapper = createSwapper(createElement('div')('A'), () => destroy)

            swapper.c()
            swapper.e()
            swapper.d()

            expect(destroy).toHaveBeenCalledTimes(1)
          })

          it('should save context', () => {
            const [ThemeContext, getTheme] = createContext('light')
            let setBlock: GetChildHook
            const ComponentA = () => createElement('div')('(A) ', getTheme())
            const ComponentB = () => createElement('div')('(B) ', getTheme())
            const swapper = provideContext(
              ThemeContext('dark'),
              () => createSwapper(ComponentA(), (sb) => {
                setBlock = sb
              })
            )
            const { container } = render(swapper)

            expect(container.innerHTML).toBe('<div><div>(A) dark</div></div>')

            setBlock!(() => ComponentB())

            expect(container.innerHTML).toBe('<div><div>(B) dark</div></div>')

            setBlock!(() => ComponentA())

            expect(container.innerHTML).toBe('<div><div>(A) dark</div></div>')
          })
        })
      })
    })
  })
})
