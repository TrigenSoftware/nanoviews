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
import { createAsyncList } from './async.js'

describe('nanoviews', () => {
  describe('internals', () => {
    describe('logic', () => {
      describe('swap', () => {
        describe('createAsyncList', () => {
          it('should render without initial footer', () => {
            let addBlock: GetChildHook
            let setFooterBlock: GetChildHook
            let resetBlocks: GetChildHook
            const list = createAsyncList(null, (a, s, r) => {
              addBlock = a
              setFooterBlock = s
              resetBlocks = r
            })
            const { container } = render(list)

            expect(container.innerHTML).toBe('<div></div>')

            addBlock!(() => createElement('div')('A'))

            expect(container.innerHTML).toBe('<div><div>A</div></div>')

            setFooterBlock!(() => 'Footer')

            expect(container.innerHTML).toBe('<div><div>A</div>Footer</div>')

            addBlock!(() => createElement('div')('B'))

            expect(container.innerHTML).toBe('<div><div>A</div><div>B</div>Footer</div>')

            resetBlocks!()

            expect(container.innerHTML).toBe('<div></div>')

            resetBlocks!(() => 'Footer')

            expect(container.innerHTML).toBe('<div>Footer</div>')
          })

          it('should render with initial footer', () => {
            let addBlock: GetChildHook
            let setFooterBlock: GetChildHook
            let resetBlocks: GetChildHook
            const list = createAsyncList('Footer', (a, s, r) => {
              addBlock = a
              setFooterBlock = s
              resetBlocks = r
            })
            const { container } = render(list)

            expect(container.innerHTML).toBe('<div>Footer</div>')

            addBlock!(() => createElement('div')('A'))

            expect(container.innerHTML).toBe('<div><div>A</div>Footer</div>')

            setFooterBlock!(() => 'retooF')

            expect(container.innerHTML).toBe('<div><div>A</div>retooF</div>')

            addBlock!(() => createElement('div')('B'))

            expect(container.innerHTML).toBe('<div><div>A</div><div>B</div>retooF</div>')

            resetBlocks!()

            expect(container.innerHTML).toBe('<div></div>')

            resetBlocks!(() => 'Footer')

            expect(container.innerHTML).toBe('<div>Footer</div>')
          })

          it('should call destroy function', () => {
            const destroy = vi.fn()
            const swapper = createAsyncList(createElement('div')('A'), () => destroy)

            swapper.c()
            swapper.e()
            swapper.d()

            expect(destroy).toHaveBeenCalledTimes(1)
          })

          it('should save context', () => {
            const [ThemeContext, getTheme] = createContext('light')
            let addBlock: GetChildHook
            let setFooterBlock: GetChildHook
            let resetBlocks: GetChildHook
            const ComponentA = () => createElement('div')('(A) ', getTheme())
            const ComponentB = () => createElement('div')('(B) ', getTheme())
            const ComponentC = () => createElement('div')('(C) ', getTheme())
            const swapper = provideContext(
              ThemeContext('dark'),
              () => createAsyncList(null, (a, s, r) => {
                addBlock = a
                setFooterBlock = s
                resetBlocks = r
              })
            )
            const { container } = render(swapper)

            expect(container.innerHTML).toBe('<div></div>')

            addBlock!(() => ComponentA())

            expect(container.innerHTML).toBe('<div><div>(A) dark</div></div>')

            setFooterBlock!(() => ComponentB())

            expect(container.innerHTML).toBe('<div><div>(A) dark</div><div>(B) dark</div></div>')

            resetBlocks!(() => ComponentC())

            expect(container.innerHTML).toBe('<div><div>(C) dark</div></div>')
          })

          it('should render in reversed order', () => {
            let addBlock: GetChildHook
            let setFooterBlock: GetChildHook
            let resetBlocks: GetChildHook
            const list = createAsyncList('Footer', (a, s, r) => {
              addBlock = a
              setFooterBlock = s
              resetBlocks = r
            }, true)
            const { container } = render(list)

            expect(container.innerHTML).toBe('<div>Footer</div>')

            addBlock!(() => createElement('div')('A'))

            expect(container.innerHTML).toBe('<div>Footer<div>A</div></div>')

            setFooterBlock!(() => 'retooF')

            expect(container.innerHTML).toBe('<div>retooF<div>A</div></div>')

            addBlock!(() => createElement('div')('B'))

            expect(container.innerHTML).toBe('<div>retooF<div>B</div><div>A</div></div>')

            resetBlocks!()

            expect(container.innerHTML).toBe('<div></div>')

            resetBlocks!(() => 'Footer')

            expect(container.innerHTML).toBe('<div>Footer</div>')
          })
        })
      })
    })
  })
})
