import {
  describe,
  it,
  expect
} from 'vitest'
import {
  mapFlatNotEmpty,
  composeEffects
} from './utils.js'

describe('nanoviews', () => {
  describe('internals', () => {
    describe('utils', () => {
      describe('mapFlatNotEmpty', () => {
        it('should map flat items', () => {
          const items = [
            1,
            2,
            3
          ]
          const result = mapFlatNotEmpty(items, item => item * 2)

          expect(result).toEqual([
            2,
            4,
            6
          ])
        })

        it('should map non-empty flat items', () => {
          const items = [
            1,
            undefined,
            2,
            null,
            3
          ]
          const result = mapFlatNotEmpty(items, item => item * 2)

          expect(result).toEqual([
            2,
            4,
            6
          ])
        })

        it('should map non-empty flat items and results', () => {
          const items = [
            1,
            undefined,
            2,
            null,
            3
          ]
          const result = mapFlatNotEmpty(items, (item) => {
            if (item === 2) {
              return undefined
            }

            return item * 2
          })

          expect(result).toEqual([2, 6])
        })

        it('should map nested items', () => {
          const items = [
            1,
            [2, 3],
            [4, [5, 6]],
            7
          ]
          const result = mapFlatNotEmpty(items, item => item * 2)

          expect(result).toEqual([
            2,
            4,
            6,
            8,
            10,
            12,
            14
          ])
        })

        it('should map non-empty nested items', () => {
          const items = [
            1,
            [2, undefined],
            [4, [null, 6]],
            7
          ]
          const result = mapFlatNotEmpty(items, item => item * 2)

          expect(result).toEqual([
            2,
            4,
            8,
            12,
            14
          ])
        })

        it('should map non-empty nested items and results', () => {
          const items = [
            1,
            [2, undefined],
            [4, [null, 6]],
            7
          ]
          const result = mapFlatNotEmpty(items, (item) => {
            if (item === 4) {
              return undefined
            }

            return item * 2
          })

          expect(result).toEqual([
            2,
            4,
            12,
            14
          ])
        })
      })

      describe('composeEffects', () => {
        it('should compose effects into a single effect', () => {
          const orderCheck: number[] = []
          const composedEffect = composeEffects(
            (value: number) => {
              orderCheck.push(value * 2)

              return () => {
                orderCheck.push(value * 2)
              }
            },
            (value: number) => {
              orderCheck.push(value * 3)
            },
            (value: number) => () => {
              orderCheck.push(value * 4)
            },
            (value: number) => {
              orderCheck.push(value * 5)

              return () => {
                orderCheck.push(value * 5)
              }
            }
          )
          const destroy = composedEffect(2)

          expect(orderCheck).toEqual([
            4,
            6,
            10
          ])

          destroy()

          expect(orderCheck).toEqual([
            4,
            6,
            10,
            4,
            8,
            10
          ])
        })
      })
    })
  })
})
