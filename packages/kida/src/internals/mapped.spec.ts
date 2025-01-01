import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { signal } from './signal.js'
import { listen } from './lifecycle.js'
import { mapped } from './mapped.js'

describe('stores', () => {
  describe('internals', () => {
    describe('mapped', () => {
      it('should map value', () => {
        const $a = signal(1)
        const $b = mapped($a, value => `${value + 1}`)
        const listener = vi.fn()

        expect($b.get()).toBe('2')

        const off = listen($b, listener)

        $a.set(2)

        expect(listener).toHaveBeenCalledWith('3', '2')
        expect(listener).toHaveBeenCalledTimes(1)
        expect($b.get()).toBe('3')

        $a.set(3)
        $a.set(4)

        expect(listener).toHaveBeenCalledWith('5', '4')
        expect(listener).toHaveBeenCalledTimes(3)
        expect($b.get()).toBe('5')

        off()
      })

      it('should lazy map while turned off', () => {
        const $a = signal(1)
        const $b = mapped($a, value => `${value + 1}`)

        expect($b.get()).toBe('2')

        $a.set(2)

        expect($b.get()).toBe('3')
      })

      it('should set value inside listener', () => {
        const $val = signal(1)
        const $mapped1 = mapped($val, String)
        const $mapped2 = mapped($mapped1, String)
        const events: string[] = []
        const listener1 = (val: number) => events.push(`val ${val}`)
        const listener2 = (mapped2: string) => {
          events.push(`mapped2 ${mapped2}`)

          if (Number(mapped2) % 2 === 1) {
            $val.set($val.get() + 1)
          }
        }
        const off = listen($val, listener1)
        const off2 = listen($mapped2, listener2)

        listener1($val.get())
        listener2($mapped2.get())

        expect(events).toEqual([
          'val 1',
          'mapped2 1',
          'val 2',
          'mapped2 2'
        ])

        $val.set(3)

        expect(events).toEqual([
          'val 1',
          'mapped2 1',
          'val 2',
          'mapped2 2',
          'val 3',
          'mapped2 3',
          'val 4',
          'mapped2 4'
        ])

        off()
        off2()
      })
    })
  })
})
