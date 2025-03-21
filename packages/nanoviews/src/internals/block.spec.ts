import {
  describe,
  it,
  expect
} from 'vitest'
import {
  $$mount,
  $$node,
  $$destroy
} from './symbols.js'
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

          block[$$mount](root, anchor)

          expect(block[$$node]).toBe(node)
          expect(root.firstChild).toBe(node)

          block[$$mount](root)

          expect(root.lastChild).toBe(node)

          block[$$destroy]()

          expect(root).not.toContainElement(node)
        })
      })
    })
  })
})
