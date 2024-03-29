import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { atom } from 'nanostores'
import * as Stories from './await.stories.js'

const { PendingState: Demo } = composeStories(Stories)

describe('nanoviews', () => {
  describe('logic', () => {
    describe('await', () => {
      it('should handle promise resolve', async () => {
        let resolve: (value: string) => void
        const promise = new Promise<string>((r) => {
          resolve = r
        })
        const { container } = render(Demo({
          getPromise: () => promise
        }))

        expect(container.innerHTML).toBe('<div><b>Loading...</b></div>')

        resolve!('Hello, world!')

        await promise

        expect(container.innerHTML).toBe('<div><p>Resolved: Hello, world!</p></div>')
      })

      it('should handle promise reject', async () => {
        let reject: (value: string) => void
        const promise = new Promise<string>((_, r) => {
          reject = r
        })
        const { container } = render(Demo({
          getPromise: () => promise
        }))

        expect(container.innerHTML).toBe('<div><b>Loading...</b></div>')

        reject!('Hello, world!')

        try {
          await promise
        } catch (error) {
          expect(container.innerHTML).toBe('<div><p>Rejected: Hello, world!</p></div>')
        }
      })

      it('should handle reactive promise', async () => {
        let resolve: (value: string) => void
        const promise = atom(new Promise<string>((r) => {
          resolve = r
        }))
        const { container } = render(Demo({
          getPromise: () => promise
        }))

        expect(container.innerHTML).toBe('<div><b>Loading...</b></div>')

        resolve!('Hello, world!')

        await promise.get()

        expect(container.innerHTML).toBe('<div><p>Resolved: Hello, world!</p></div>')

        promise.set(new Promise<string>((r) => {
          resolve = r
        }))

        expect(container.innerHTML).toBe('<div><b>Loading...</b></div>')

        resolve!('Hello, nanoviews!')

        await promise.get()

        expect(container.innerHTML).toBe('<div><p>Resolved: Hello, nanoviews!</p></div>')
      })
    })
  })
})
