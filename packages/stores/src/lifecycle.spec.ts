import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import type { StoreValue } from './types/index.js'
import { atom } from './atom.js'
import { listenKeys } from './lifecycle.js'

describe('stores', () => {
  describe('lifecycle', () => {
    describe('listenKeys', () => {
      it('should listen root key change', () => {
        const $obj = atom({
          a: 1,
          b: 2,
          c: 3
        })
        const listener = vi.fn()
        const off = listenKeys($obj, ['a', 'c'], listener)

        $obj.set({
          a: 1,
          b: 2,
          c: 3
        })

        expect(listener).not.toHaveBeenCalled()

        $obj.set({
          a: 2,
          b: 2,
          c: 4
        })

        expect(listener).toHaveBeenCalledWith({
          a: 2,
          b: 2,
          c: 4
        }, {
          a: 1,
          b: 2,
          c: 3
        }, ['a', 'c'], {})

        listener.mockClear()

        $obj.set({
          a: 2,
          b: 0,
          c: 4
        })

        expect(listener).not.toHaveBeenCalled()

        off()
      })

      it('should listen nested key change', () => {
        const $obj = atom({
          a: {
            b: {
              a: 0,
              c: 1
            }
          },
          b: 2
        })
        const listener = vi.fn()
        const cKey = (value: StoreValue<typeof $obj>) => value.a.b.c
        const off = listenKeys($obj, [cKey], listener)

        $obj.set({
          a: {
            b: {
              a: 0,
              c: 1
            }
          },
          b: 2
        })

        expect(listener).not.toHaveBeenCalled()

        $obj.set({
          a: {
            b: {
              a: 0,
              c: 2
            }
          },
          b: 2
        })

        expect(listener).toHaveBeenCalledWith({
          a: {
            b: {
              a: 0,
              c: 2
            }
          },
          b: 2
        }, {
          a: {
            b: {
              a: 0,
              c: 1
            }
          },
          b: 2
        }, [cKey], {})

        listener.mockClear()

        $obj.set({
          a: {
            b: {
              a: 1,
              c: 2
            }
          },
          b: 3
        })

        expect(listener).not.toHaveBeenCalled()

        off()
      })
    })
  })
})
