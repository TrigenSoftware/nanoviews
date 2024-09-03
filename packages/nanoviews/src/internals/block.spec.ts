import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  createBlock,
  createBlockFromNode,
  createBlockFromBlocks
} from './block.js'

function timesMap<T>(n: number, callback: (index: number) => T) {
  return Array.from({
    length: n
  }, (_, index) => callback(index))
}

describe('nanoviews', () => {
  describe('internals', () => {
    describe('block', () => {
      describe('createBlockFromNode', () => {
        it('should handle dom manipulations for node', () => {
          const root = document.createElement('main')
          const anchor = document.createElement('p')
          const node = document.createElement('div')

          root.appendChild(anchor)

          const block = createBlockFromNode(() => node)

          block.c()
          block.m(root, anchor)

          expect(block.n()).toBe(node)
          expect(root.firstChild).toBe(node)

          block.m(root)

          expect(root.lastChild).toBe(node)

          block.d()

          expect(root).not.toContainElement(node)
        })

        it('should handle dom manipulations for node and child block', () => {
          const root = document.createElement('main')
          const anchor = document.createElement('p')
          const node = document.createElement('div')
          const childNode = document.createElement('span')

          root.appendChild(anchor)

          const childBlock = createBlockFromNode(() => childNode)
          const block = createBlockFromNode(() => node, childBlock)

          childBlock.e = vi.fn()

          block.c()
          block.m(root, anchor)

          expect(block.n()).toBe(node)
          expect(childBlock.n()).toBe(childNode)
          expect(root.firstChild).toBe(node)
          expect(node.firstChild).toBe(childNode)

          block.e()

          expect(childBlock.e).toHaveBeenCalledTimes(1)

          block.d()

          expect(root).not.toContainElement(node)
          expect(root).not.toContainElement(childNode)
        })
      })

      describe('createBlockFromBlocks', () => {
        it('should handle children lifesycles', () => {
          const childrenCount = 3
          const creates = timesMap(childrenCount, () => vi.fn())
          const mounts = timesMap(childrenCount, () => vi.fn(() => document.createTextNode('')))
          const effects = timesMap(childrenCount, () => vi.fn())
          const destroys = timesMap(childrenCount, () => vi.fn())
          const blocks = timesMap(childrenCount, index => createBlock(creates[index], mounts[index], effects[index], destroys[index]))
          const block = createBlockFromBlocks(blocks)

          block.c()

          creates.forEach((create) => {
            expect(create).toHaveBeenCalledTimes(1)
          })

          block.m(document.createElement('main'))

          mounts.forEach((mount) => {
            expect(mount).toHaveBeenCalledTimes(1)
          })

          block.e()

          effects.forEach((effect) => {
            expect(effect).toHaveBeenCalledTimes(1)
          })

          block.d()

          destroys.forEach((destroy) => {
            expect(destroy).toHaveBeenCalledTimes(1)
          })
        })

        it('should mount children to target', () => {
          const target = document.createElement('main')
          const node1 = document.createElement('div')
          const node2 = document.createElement('span')
          const block = createBlockFromBlocks([createBlockFromNode(() => node1), createBlockFromNode(() => node2)])

          block.c()
          block.m(target)

          expect(target.firstChild).toBe(node1)
          expect(target.lastChild).toBe(node2)

          block.d()

          expect(target).not.toContainElement(node1)
          expect(target).not.toContainElement(node2)
        })
      })
    })
  })
})
