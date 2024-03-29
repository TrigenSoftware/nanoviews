import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { atom } from 'nanostores'
import * as Stories from './forAwait.stories.js'

const {
  PendingState: Demo,
  Reversed: ReversedDemo
} = composeStories(Stories)

function withResolvers<T>() {
  let resolve: (value: T) => void
  let reject: (value: Error) => void
  const promise = new Promise<T>((r, j) => {
    resolve = r
    reject = j
  })

  return {
    promise,
    resolve: resolve!,
    reject: reject!
  }
}

function mockStream<T>() {
  const promises = [withResolvers<T>(), withResolvers<T>()]

  async function* createStream() {
    yield promises[0].promise
    yield promises[1].promise
  }

  return [createStream(), promises] as const
}

describe('nanoviews', () => {
  describe('logic', () => {
    describe('forAwait', () => {
      it('should handle async iterable', async () => {
        const [stream, promises] = mockStream<string>()
        const { container } = render(Demo({
          getStream: () => stream
        }))

        expect(container.innerHTML).toBe('<div><ul><b>Loading...</b></ul></div>')

        promises[0].resolve('First')

        await promises[0].promise
        // Step over next async generator microtask
        await Promise.resolve()

        expect(container.innerHTML).toBe('<div><ul><li>Item #0: First</li><b>Loading...</b></ul></div>')

        promises[1].resolve('Second')

        await promises[1].promise
        // Step over next async generator microtask
        await Promise.resolve()

        expect(container.innerHTML).toBe('<div><ul><li>Item #0: First</li><li>Item #1: Second</li><b>Loading...</b></ul></div>')

        // Step over next async generator microtask
        await Promise.resolve()

        expect(container.innerHTML).toBe('<div><ul><li>Item #0: First</li><li>Item #1: Second</li><b>Total: 2</b></ul></div>')
      })

      it('should handle async iterable with error', async () => {
        const [stream, promises] = mockStream<string>()
        const { container } = render(Demo({
          getStream: () => stream
        }))

        expect(container.innerHTML).toBe('<div><ul><b>Loading...</b></ul></div>')

        promises[0].resolve('First')

        await promises[0].promise
        // Step over next async generator microtask
        await Promise.resolve()

        expect(container.innerHTML).toBe('<div><ul><li>Item #0: First</li><b>Loading...</b></ul></div>')

        promises[1].reject(new Error('Something went wrong!'))

        try {
          await promises[1].promise
        } catch (error) {
          // Step over next async generator microtask
          await Promise.resolve()

          expect(container.innerHTML).toBe('<div><ul><li>Item #0: First</li><b>Rejected: Error: Something went wrong!</b></ul></div>')
        }
      })

      it('should handle reactive async iterable', async () => {
        let [stream, promises] = mockStream<string>()
        const $stream = atom(stream)
        const { container } = render(Demo({
          getStream: () => $stream
        }))

        expect(container.innerHTML).toBe('<div><ul><b>Loading...</b></ul></div>')

        promises[0].resolve('First')

        await promises[0].promise
        // Step over next async generator microtask
        await Promise.resolve()

        expect(container.innerHTML).toBe('<div><ul><li>Item #0: First</li><b>Loading...</b></ul></div>')

        ;[stream, promises] = mockStream<string>()

        $stream.set(stream)

        promises[0].resolve('Number one')

        await promises[0].promise
        // Step over next async generator microtask
        await Promise.resolve()

        expect(container.innerHTML).toBe('<div><ul><li>Item #0: Number one</li><b>Loading...</b></ul></div>')
      })

      it('should handle async iterable in reversed order', async () => {
        const [stream, promises] = mockStream<string>()
        const { container } = render(ReversedDemo({
          getStream: () => stream
        }))

        expect(container.innerHTML).toBe('<div><ul><b>Loading...</b></ul></div>')

        promises[0].resolve('First')

        await promises[0].promise
        // Step over next async generator microtask
        await Promise.resolve()

        expect(container.innerHTML).toBe('<div><ul><b>Loading...</b><li>Item #0: First</li></ul></div>')

        promises[1].resolve('Second')

        await promises[1].promise
        // Step over next async generator microtask
        await Promise.resolve()

        expect(container.innerHTML).toBe('<div><ul><b>Loading...</b><li>Item #1: Second</li><li>Item #0: First</li></ul></div>')

        // Step over next async generator microtask
        await Promise.resolve()

        expect(container.innerHTML).toBe('<div><ul><b>Total: 2</b><li>Item #1: Second</li><li>Item #0: First</li></ul></div>')
      })
    })
  })
})
