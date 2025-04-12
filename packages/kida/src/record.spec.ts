import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  effect,
  computed,
  signal,
  isSignal,
  update
} from 'agera'
import {
  record,
  deepRecord
} from './record.js'

describe('kida', () => {
  describe('record', () => {
    describe('record', () => {
      it('should create record store', () => {
        const $record = record({
          firstname: 'Dan',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })

        expect($record.$firstname).toSatisfy(isSignal)
        expect($record.$lastname).toSatisfy(isSignal)
        expect($record.$age).toSatisfy(isSignal)
        expect($record.$city).toSatisfy(isSignal)

        expect($record.$firstname()).toBe('Dan')
        expect($record.$lastname()).toBe('Onoshko')
        expect($record.$age()).toBe(29)
        expect($record.$city()).toBe('Batumi')
      })

      it('should update root by child', () => {
        const $record = record({
          firstname: 'Dan',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })

        expect($record.$firstname()).toBe('Dan')

        $record.$firstname('Daniil')

        expect($record.$firstname()).toBe('Daniil')
        expect($record()).toEqual({
          firstname: 'Daniil',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })
      })

      it('should update root by child and notify listeners', () => {
        const $record = record({
          firstname: 'Dan',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })
        const rootListener = vi.fn()
        const childListener = vi.fn()
        const off = effect(() => {
          rootListener($record())
        })
        const offChild = effect(() => {
          childListener($record.$firstname())
        })

        expect(rootListener).toHaveBeenCalledTimes(1)
        expect(childListener).toHaveBeenCalledTimes(1)

        $record.$firstname('Daniil')

        expect(rootListener).toHaveBeenCalledTimes(2)
        expect(rootListener).toHaveBeenCalledWith({
          firstname: 'Daniil',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })
        expect(childListener).toHaveBeenCalledTimes(2)
        expect(childListener).toHaveBeenCalledWith('Daniil')

        off()
        offChild()
      })

      it('should update child by root', () => {
        const $record = record({
          firstname: 'Dan',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })

        expect($record.$firstname()).toBe('Dan')

        update($record, data => ({
          ...data,
          firstname: 'Daniil'
        }))

        expect($record.$firstname()).toBe('Daniil')
      })

      it('should update child by root and notify listeners', () => {
        const $record = record({
          firstname: 'Dan',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })
        const rootListener = vi.fn()
        const childListener = vi.fn()
        const off = effect(() => {
          rootListener($record())
        })
        const offChild = effect(() => {
          childListener($record.$firstname())
        })

        expect(rootListener).toHaveBeenCalledTimes(1)
        expect(childListener).toHaveBeenCalledTimes(1)

        expect($record.$firstname()).toBe('Dan')

        update($record, data => ({
          ...data,
          firstname: 'Daniil'
        }))

        expect(rootListener).toHaveBeenCalledTimes(2)
        expect(rootListener).toHaveBeenCalledWith({
          firstname: 'Daniil',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })
        expect(childListener).toHaveBeenCalledTimes(2)
        expect(childListener).toHaveBeenCalledWith('Daniil')

        off()
        offChild()
      })

      it('should create record store from other store', () => {
        const $name = signal('Dan Onoshko')
        const $record = record(computed(() => ({
          name: $name(),
          location: 'Batumi'
        })))

        expect($record()).toEqual({
          name: 'Dan Onoshko',
          location: 'Batumi'
        })
        expect($record.$name()).toBe('Dan Onoshko')

        $name('Daniil Onoshko')

        expect($record()).toEqual({
          name: 'Daniil Onoshko',
          location: 'Batumi'
        })
        expect($record.$name()).toBe('Daniil Onoshko')
      })
    })

    describe('deepRecord', () => {
      it('should create deep record store', () => {
        const $record = deepRecord({
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        })

        expect($record.$name).toSatisfy(isSignal)
        expect($record.$location).toSatisfy(isSignal)
        expect($record.$location.$city).toSatisfy(isSignal)
        expect($record.$location.$country).toSatisfy(isSignal)

        expect($record.$name()).toBe('Dan Onoshko')
        expect($record.$location()).toEqual({
          city: 'Batumi',
          country: 'Georgia'
        })
        expect($record.$location.$city()).toBe('Batumi')
        expect($record.$location.$country()).toBe('Georgia')
      })

      it('should update root by child', () => {
        const $record = deepRecord({
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        })

        expect($record.$location.$city()).toBe('Batumi')

        $record.$location.$city('ბათუმი')

        expect($record.$location.$city()).toBe('ბათუმი')
        expect($record.$location()).toEqual({
          city: 'ბათუმი',
          country: 'Georgia'
        })
        expect($record()).toEqual({
          name: 'Dan Onoshko',
          location: {
            city: 'ბათუმი',
            country: 'Georgia'
          }
        })
      })

      it('should update root by child and notify listeners', () => {
        const $record = deepRecord({
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        })
        const rootListener = vi.fn()
        const childListener = vi.fn()
        const leafListener = vi.fn()
        const off = effect(() => {
          rootListener($record())
        })
        const offChild = effect(() => {
          childListener($record.$location())
        })
        const offLeaf = effect(() => {
          leafListener($record.$location.$city())
        })

        expect(rootListener).toHaveBeenCalledTimes(1)
        expect(childListener).toHaveBeenCalledTimes(1)
        expect(leafListener).toHaveBeenCalledTimes(1)

        $record.$location.$city('ბათუმი')

        expect(rootListener).toHaveBeenCalledTimes(2)
        expect(rootListener).toHaveBeenCalledWith({
          name: 'Dan Onoshko',
          location: {
            city: 'ბათუმი',
            country: 'Georgia'
          }
        })
        expect(childListener).toHaveBeenCalledTimes(2)
        expect(childListener).toHaveBeenCalledWith({
          city: 'ბათუმი',
          country: 'Georgia'
        })
        expect(leafListener).toHaveBeenCalledTimes(2)
        expect(leafListener).toHaveBeenCalledWith('ბათუმი')

        off()
        offChild()
        offLeaf()
      })

      it('should update child by root', () => {
        const $record = deepRecord({
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        })

        expect($record.$location.$city()).toBe('Batumi')

        update($record, data => ({
          ...data,
          location: {
            ...data.location,
            city: 'ბათუმი'
          }
        }))

        expect($record.$location.$city()).toBe('ბათუმი')
      })

      it('should update child by root and notify listeners', () => {
        const $record = deepRecord({
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        })
        const rootListener = vi.fn()
        const childListener = vi.fn()
        const leafListener = vi.fn()
        const off = effect(() => {
          rootListener($record())
        })
        const offChild = effect(() => {
          childListener($record.$location())
        })
        const offLeaf = effect(() => {
          leafListener($record.$location.$city())
        })

        expect(rootListener).toHaveBeenCalledTimes(1)
        expect(childListener).toHaveBeenCalledTimes(1)
        expect(leafListener).toHaveBeenCalledTimes(1)

        expect($record.$location.$city()).toBe('Batumi')

        update($record, data => ({
          ...data,
          location: {
            ...data.location,
            city: 'ბათუმი'
          }
        }))

        expect(rootListener).toHaveBeenCalledTimes(2)
        expect(rootListener).toHaveBeenCalledWith({
          name: 'Dan Onoshko',
          location: {
            city: 'ბათუმი',
            country: 'Georgia'
          }
        })
        expect(childListener).toHaveBeenCalledTimes(2)
        expect(childListener).toHaveBeenCalledWith({
          city: 'ბათუმი',
          country: 'Georgia'
        })
        expect(leafListener).toHaveBeenCalledTimes(2)
        expect(leafListener).toHaveBeenCalledWith('ბათუმი')

        off()
        offChild()
        offLeaf()
      })

      it('should create record store from other store', () => {
        const $city = signal('Batumi')
        const $record = deepRecord(computed(() => ({
          name: 'Dan Onoshko',
          location: {
            city: $city(),
            country: 'Georgia'
          }
        })))

        expect($record()).toEqual({
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        })
        expect($record.$location.$city()).toBe('Batumi')

        $city('ბათუმი')

        expect($record()).toEqual({
          name: 'Dan Onoshko',
          location: {
            city: 'ბათუმი',
            country: 'Georgia'
          }
        })
        expect($record.$location.$city()).toBe('ბათუმი')
      })
    })
  })
})
