import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { effect } from 'agera'
import type { SignalsMap } from './internals/index.js'
import {
  getMapKey,
  setMapKey,
  clearMap,
  deleteMapKey
} from './map.js'

describe('kida', () => {
  describe('map', () => {
    describe('getMapKey', () => {
      it('should return undefined for non-existent key', () => {
        const map: SignalsMap<string, number> = new Map()

        expect(getMapKey(map, 'foo')).toBeUndefined()
      })

      it('should return value for existing key', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)

        expect(getMapKey(map, 'foo')).toBe(42)
      })

      it('should track new key insertions', () => {
        const map: SignalsMap<string, number> = new Map()
        const listener = vi.fn()
        const off = effect(() => {
          listener(getMapKey(map, 'foo'))
        })

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(undefined)

        setMapKey(map, 'foo', 42)

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(42)

        off()
      })

      it('should track value updates', () => {
        const map: SignalsMap<string, number> = new Map()
        const listener = vi.fn()

        setMapKey(map, 'foo', 42)

        const off = effect(() => {
          listener(getMapKey(map, 'foo'))
        })

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(42)

        setMapKey(map, 'foo', 100)

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(100)

        off()
      })

      it('should track clear events', () => {
        const map: SignalsMap<string, number> = new Map()
        const listener = vi.fn()

        setMapKey(map, 'foo', 42)

        const off = effect(() => {
          listener(getMapKey(map, 'foo'))
        })

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(42)

        clearMap(map)

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(undefined)

        off()
      })
    })

    describe('setMapKey', () => {
      it('should set value for new key', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)

        expect(getMapKey(map, 'foo')).toBe(42)
      })

      it('should update value for existing key', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)

        expect(getMapKey(map, 'foo')).toBe(42)

        setMapKey(map, 'foo', 100)

        expect(getMapKey(map, 'foo')).toBe(100)
      })

      it('should set value with updater function', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)

        expect(getMapKey(map, 'foo')).toBe(42)

        setMapKey(map, 'foo', prev => (prev ?? 0) + 10)

        expect(getMapKey(map, 'foo')).toBe(52)
      })

      it('should notify listeners on insert', () => {
        const map: SignalsMap<string, number> = new Map()
        const listener = vi.fn()
        const off = effect(() => {
          listener(getMapKey(map, 'foo'))
        })

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(undefined)

        setMapKey(map, 'foo', 42)

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(42)

        off()
      })

      it('should notify listeners on update', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)

        const listener = vi.fn()
        const off = effect(() => {
          listener(getMapKey(map, 'foo'))
        })

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(42)

        setMapKey(map, 'foo', 100)

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(100)

        off()
      })
    })

    describe('clearMap', () => {
      it('should remove all keys from map', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)
        setMapKey(map, 'bar', 100)

        clearMap(map)

        expect(getMapKey(map, 'foo')).toBeUndefined()
        expect(getMapKey(map, 'bar')).toBeUndefined()
      })

      it('should notify listeners', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)

        const listener = vi.fn()
        const off = effect(() => {
          listener(getMapKey(map, 'foo'))
        })

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(42)

        clearMap(map)

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(undefined)

        setMapKey(map, 'foo', 100)

        expect(listener).toHaveBeenCalledTimes(3)
        expect(listener).toHaveBeenCalledWith(100)

        off()
      })
    })

    describe('deleteMapKey', () => {
      it('should delete existing key', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)

        expect(getMapKey(map, 'foo')).toBe(42)

        deleteMapKey(map, 'foo')

        expect(map.has('foo')).toBe(false)
      })

      it('should allow re-adding deleted key', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)
        deleteMapKey(map, 'foo')
        setMapKey(map, 'foo', 100)

        expect(getMapKey(map, 'foo')).toBe(100)
      })

      it('should notify listeners on delete', () => {
        const map: SignalsMap<string, number> = new Map()

        setMapKey(map, 'foo', 42)

        const listener = vi.fn()
        const off = effect(() => {
          listener(getMapKey(map, 'foo'))
        })

        expect(listener).toHaveBeenCalledTimes(1)
        expect(listener).toHaveBeenCalledWith(42)

        deleteMapKey(map, 'foo')

        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener).toHaveBeenCalledWith(undefined)

        setMapKey(map, 'foo', 100)

        expect(listener).toHaveBeenCalledTimes(3)
        expect(listener).toHaveBeenCalledWith(100)

        off()
      })
    })
  })
})
