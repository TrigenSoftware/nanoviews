import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect
} from 'vitest'
import {
  EventTargetSymbol,
  CHANGE
} from './events/index.js'
import { atom } from './atom.js'
import { listen } from './lifecycle.js'
import { batch } from './effect.js'
import { computed } from './computed.js'

describe('stores', () => {
  describe('internals', () => {
    describe('computed', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.restoreAllMocks()
      })

      it('should compute signle value', () => {
        const $a = atom(1)
        const $b = computed($a, value => `${value + 1}`)
        const listener = vi.fn()
        const off = listen($b, listener)

        expect($b.get()).toBe('2')

        $a.set(2)

        expect(listener).toHaveBeenCalledWith('3', '2', {})
        expect(listener).toHaveBeenCalledTimes(1)
        expect($b.get()).toBe('3')

        $a.set(3)
        $a.set(4)

        expect(listener).toHaveBeenCalledWith('5', '4', {})
        expect(listener).toHaveBeenCalledTimes(3)
        expect($b.get()).toBe('5')

        off()
        vi.runAllTimers()
      })

      it('should lazy compute while turned off', () => {
        const $a = atom(1)
        const $b = computed($a, value => `${value + 1}`)

        expect($b.get()).toBe('2')

        $a.set(2)

        expect($b.get()).toBe('3')
      })

      it('should compute single value with debounce', () => {
        const $a = atom(1)
        const $b = computed($a, value => `${value + 1}`, batch)
        const listener = vi.fn()
        const off = listen($b, listener)

        expect($b.get()).toBe('2')

        $a.set(2)

        expect(listener).toHaveBeenCalledTimes(0)
        vi.runAllTimers()
        expect(listener).toHaveBeenCalledWith('3', '2', {})
        expect(listener).toHaveBeenCalledTimes(1)
        expect($b.get()).toBe('3')

        $a.set(3)
        $a.set(4)

        expect(listener).toHaveBeenCalledTimes(1)
        vi.runAllTimers()
        expect(listener).toHaveBeenCalledWith('5', '3', {})
        expect(listener).toHaveBeenCalledTimes(2)
        expect($b.get()).toBe('5')

        off()
        vi.runAllTimers()
      })

      it('should clean up on unmount', () => {
        const $a = atom(1)
        const $b = computed($a, value => `${value + 1}`)

        expect($a[EventTargetSymbol].get(CHANGE)?.length).toBe(undefined)
        expect($b[EventTargetSymbol].get(CHANGE)?.length).toBe(undefined)

        const off = listen($b, () => {})

        expect($a[EventTargetSymbol].get(CHANGE)?.length).toBe(2)
        expect($b[EventTargetSymbol].get(CHANGE)?.length).toBe(2)

        off()
        vi.runAllTimers()

        expect($a[EventTargetSymbol].get(CHANGE)?.length).toBe(undefined)
        expect($b[EventTargetSymbol].get(CHANGE)?.length).toBe(undefined)
      })

      it('should compute multiple values', () => {
        const $a = atom(1)
        const $b = atom(2)
        const $c = computed([$a, $b], (a, b) => `${a + b}`)
        const listener = vi.fn()
        const off = listen($c, listener)

        expect($c.get()).toBe('3')

        $a.set(2)

        expect(listener).toHaveBeenCalledWith('4', '3', {})
        expect(listener).toHaveBeenCalledTimes(1)
        expect($c.get()).toBe('4')

        $b.set(3)

        expect(listener).toHaveBeenCalledWith('5', '4', {})
        expect(listener).toHaveBeenCalledTimes(2)
        expect($c.get()).toBe('5')

        off()
        vi.runAllTimers()
      })

      it('should compute multiple values with debounce', () => {
        const $a = atom(1)
        const $b = atom(2)
        const $c = computed([$a, $b], (a, b) => `${a + b}`, batch)
        const listener = vi.fn()
        const off = listen($c, listener)

        expect($c.get()).toBe('3')

        $a.set(2)

        expect(listener).toHaveBeenCalledTimes(0)
        vi.runAllTimers()
        expect(listener).toHaveBeenCalledWith('4', '3', {})
        expect(listener).toHaveBeenCalledTimes(1)
        expect($c.get()).toBe('4')

        $a.set(3)
        $b.set(3)

        expect(listener).toHaveBeenCalledTimes(1)
        vi.runAllTimers()
        expect(listener).toHaveBeenCalledWith('6', '4', {})
        expect(listener).toHaveBeenCalledTimes(2)
        expect($c.get()).toBe('6')

        off()
        vi.runAllTimers()
      })

      const replacer = (...args: [string, string]) => (v: string) => v.replace(...args)

      it('should prevent diamond dependency problem 1', () => {
        const $store = atom(0)
        const values: string[] = []
        const $a = computed($store, v => `a${v}`)
        const $b = computed($a, replacer('a', 'b'))
        const $c = computed($a, replacer('a', 'c'))
        const $d = computed($a, replacer('a', 'd'))
        const $combined = computed([
          $b,
          $c,
          $d
        ], (b, c, d) => `${b}${c}${d}`)
        const unsubscribe = listen($combined, (v) => {
          values.push(v)
        })

        values.push($combined.get())

        expect(values).toEqual(['b0c0d0'])

        $store.set(1)
        $store.set(2)

        expect(values).toEqual([
          'b0c0d0',
          'b1c1d1',
          'b2c2d2'
        ])

        unsubscribe()
      })

      it('should prevent diamond dependency problem 2', () => {
        const $store = atom(0)
        const values: string[] = []
        const $a = computed($store, v => `a${v}`)
        const $b = computed($a, replacer('a', 'b'))
        const $c = computed($b, replacer('b', 'c'))
        const $d = computed($c, replacer('c', 'd'))
        const $e = computed($d, replacer('d', 'e'))
        const $combined = computed([$a, $e], (a, e) => `${a}${e}`)
        const unsubscribe = listen($combined, (v) => {
          values.push(v)
        })

        values.push($combined.get())

        expect(values).toEqual(['a0e0'])

        $store.set(1)
        expect(values).toEqual(['a0e0', 'a1e1'])

        unsubscribe()
      })

      it('should prevent diamond dependency problem 3', () => {
        const $store = atom(0)
        const values: string[] = []
        const $a = computed($store, store => `a${store}`)
        const $b = computed($a, replacer('a', 'b'))
        const $c = computed($b, replacer('b', 'c'))
        const $d = computed($c, replacer('c', 'd'))
        const $combined = computed([
          $a,
          $b,
          $c,
          $d
        ], (a, b, c, d) => `${a}${b}${c}${d}`)
        const unsubscribe = listen($combined, (v) => {
          values.push(v)
        })

        values.push($combined.get())

        expect(values).toEqual(['a0b0c0d0'])

        $store.set(1)
        expect(values).toEqual(['a0b0c0d0', 'a1b1c1d1'])

        unsubscribe()
      })

      it('should prevent diamond dependency problem 4 (complex)', () => {
        const $store1 = atom(0)
        const $store2 = atom(0)
        const values: string[] = []
        const fn =
          (name: string) => (...v: (number | string)[]) => `${name}${v.slice(0, v.length / 2).join('')}`
        const $a = computed($store1, fn('a'))
        const $b = computed($store2, fn('b'))
        const $c = computed([$a, $b], fn('c'))
        const $d = computed($a, fn('d'))
        const $e = computed([$c, $d], fn('e'))
        const $f = computed($e, fn('f'))
        const $g = computed($f, fn('g'))
        const $combined1 = computed($e, e => `${e}`)
        const $combined2 = computed([$e, $g], (e, g) => `${e}${g}`)
        const unsubscribe1 = listen($combined1, (v) => {
          values.push(v)
        })
        const unsubscribe2 = listen($combined2, (v) => {
          values.push(v)
        })

        values.push($combined1.get(), $combined2.get())

        expect(values).toEqual(['eca0b0da0', 'eca0b0da0gfeca0b0da0'])

        $store1.set(1)
        $store2.set(2)

        expect(values).toEqual([
          'eca0b0da0',
          'eca0b0da0gfeca0b0da0',
          'eca1b0da1',
          'eca1b0da1gfeca1b0da1',
          'eca1b2da1',
          'eca1b2da1gfeca1b2da1'
        ])

        unsubscribe1()
        unsubscribe2()
      })

      it('should prevent diamond dependency problem 5', () => {
        let events = ''
        const $firstName = atom('John')
        const $lastName = atom('Doe')
        const $fullName = computed([$firstName, $lastName], (first, last) => {
          events += 'full '
          return `${first} ${last}`
        })
        const $isFirstShort = computed($firstName, (name) => {
          events += 'short '
          return name.length < 10
        })
        const $displayName = computed(
          [
            $firstName,
            $isFirstShort,
            $fullName
          ],
          (first, isShort, full) => {
            events += 'display '
            return isShort ? full : first
          }
        )

        expect(events).toBe('full short display ')

        const unsubscribe = listen($displayName, () => {})

        expect($displayName.get()).toBe('John Doe')
        expect(events).toBe('full short display ')

        $firstName.set('Benedict')
        expect($displayName.get()).toBe('Benedict Doe')
        expect(events).toBe('full short display short full display ')

        $firstName.set('Montgomery')
        expect($displayName.get()).toBe('Montgomery')
        expect(events).toBe('full short display short full display short full display ')

        unsubscribe()
      })

      it('should prevent diamond dependency problem 6', () => {
        const $store1 = atom(0)
        const $store2 = atom(0)
        const values: string[] = []
        const $a = computed($store1, v => `a${v}`)
        const $b = computed($store2, v => `b${v}`)
        const $c = computed($b, v => v.replace('b', 'c'))
        const $combined = computed([$a, $c], (a, c) => `${a}${c}`)
        const unsubscribe = listen($combined, (v) => {
          values.push(v)
        })

        values.push($combined.get())

        expect(values).toEqual(['a0c0'])

        $store1.set(1)
        expect(values).toEqual(['a0c0', 'a1c0'])

        unsubscribe()
      })

      it('should set value inside listener', () => {
        const $val = atom(1)
        const $computed1 = computed($val, val => val)
        const $computed2 = computed($computed1, computed1 => computed1)
        const events: string[] = []
        const off = listen($val, val => events.push(`val ${val}`))

        events.push(`val ${$val.get()}`)

        const listener = (computed2: number) => {
          events.push(`computed2 ${computed2}`)

          if (computed2 % 2 === 1) {
            $val.set($val.get() + 1)
          }
        }
        const off2 = listen($computed2, listener)

        listener($computed2.get())

        expect(events).toEqual([
          'val 1',
          'computed2 1',
          'val 2',
          'computed2 2'
        ])

        $val.set(3)

        expect(events).toEqual([
          'val 1',
          'computed2 1',
          'val 2',
          'computed2 2',
          'val 3',
          'computed2 3',
          'val 4',
          'computed2 4'
        ])

        off()
        off2()
      })
    })
  })
})
