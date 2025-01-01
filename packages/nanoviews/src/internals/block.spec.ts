import {
  describe,
  it,
  expect
} from 'vitest'
import { NodeBlock } from './block.js'

describe('nanoviews', () => {
  describe('internals', () => {
    describe('block', () => {
      describe('NodeBlock', () => {
        it('should handle dom manipulations for node', () => {
          const root = document.createElement('main')
          const anchor = document.createElement('p')
          const node = document.createElement('div')

          root.appendChild(anchor)

          const block = new NodeBlock(node)

          block.m(root, anchor)

          expect(block.n).toBe(node)
          expect(root.firstChild).toBe(node)

          block.m(root)

          expect(root.lastChild).toBe(node)

          block.d()

          expect(root).not.toContainElement(node)
        })
      })
    })
  })
})
