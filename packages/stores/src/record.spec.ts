import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import { isStore } from './utils.js'
import { listen } from './lifecycle.js'
import { computed } from './computed.js'
import {
  atom,
  update
} from './atom.js'
import {
  record,
  deepRecord
} from './record.js'

describe('stores', () => {
  describe('record', () => {
    describe('record', () => {
      it('should create record store', () => {
        const $record = record({
          firstname: 'Dan',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })

        expect($record.firstname).toSatisfy(isStore)
        expect($record.lastname).toSatisfy(isStore)
        expect($record.age).toSatisfy(isStore)
        expect($record.city).toSatisfy(isStore)

        expect($record.firstname.get()).toBe('Dan')
        expect($record.lastname.get()).toBe('Onoshko')
        expect($record.age.get()).toBe(29)
        expect($record.city.get()).toBe('Batumi')
      })

      it('should update root by child', () => {
        const $record = record({
          firstname: 'Dan',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        })

        expect($record.firstname.get()).toBe('Dan')

        $record.firstname.set('Daniil')

        expect($record.firstname.get()).toBe('Daniil')
        expect($record.get()).toEqual({
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
        const off = listen($record, rootListener)
        const offChild = listen($record.firstname, childListener)

        expect(rootListener).not.toHaveBeenCalled()
        expect(childListener).not.toHaveBeenCalled()

        $record.firstname.set('Daniil')

        expect(rootListener).toHaveBeenCalledTimes(1)
        expect(rootListener).toHaveBeenCalledWith({
          firstname: 'Daniil',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        }, {
          firstname: 'Dan',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        }, {})
        expect(childListener).toHaveBeenCalledTimes(1)
        expect(childListener).toHaveBeenCalledWith('Daniil', 'Dan', {})

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

        expect($record.firstname.get()).toBe('Dan')

        update($record, data => ({
          ...data,
          firstname: 'Daniil'
        }))

        expect($record.firstname.get()).toBe('Daniil')
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
        const off = listen($record, rootListener)
        const offChild = listen($record.firstname, childListener)

        expect(rootListener).not.toHaveBeenCalled()
        expect(childListener).not.toHaveBeenCalled()

        expect($record.firstname.get()).toBe('Dan')

        update($record, data => ({
          ...data,
          firstname: 'Daniil'
        }))

        expect(rootListener).toHaveBeenCalledTimes(1)
        expect(rootListener).toHaveBeenCalledWith({
          firstname: 'Daniil',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        }, {
          firstname: 'Dan',
          lastname: 'Onoshko',
          age: 29,
          city: 'Batumi'
        }, {})
        expect(childListener).toHaveBeenCalledTimes(1)
        expect(childListener).toHaveBeenCalledWith('Daniil', 'Dan', {})

        off()
        offChild()
      })

      it('should create record store from other store', () => {
        const $name = atom('Dan Onoshko')
        const $record = record(computed($name, name => ({
          name,
          location: 'Batumi'
        })))

        expect($record.get()).toEqual({
          name: 'Dan Onoshko',
          location: 'Batumi'
        })
        expect($record.name.get()).toBe('Dan Onoshko')

        $name.set('Daniil Onoshko')

        expect($record.get()).toEqual({
          name: 'Daniil Onoshko',
          location: 'Batumi'
        })
        expect($record.name.get()).toBe('Daniil Onoshko')
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

        expect($record.name).toSatisfy(isStore)
        expect($record.location).toSatisfy(isStore)
        expect($record.location.city).toSatisfy(isStore)
        expect($record.location.country).toSatisfy(isStore)

        expect($record.name.get()).toBe('Dan Onoshko')
        expect($record.location.get()).toEqual({
          city: 'Batumi',
          country: 'Georgia'
        })
        expect($record.location.city.get()).toBe('Batumi')
        expect($record.location.country.get()).toBe('Georgia')
      })

      it('should update root by child', () => {
        const $record = deepRecord({
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        })

        expect($record.location.city.get()).toBe('Batumi')

        $record.location.city.set('ბათუმი')

        expect($record.location.city.get()).toBe('ბათუმი')
        expect($record.location.get()).toEqual({
          city: 'ბათუმი',
          country: 'Georgia'
        })
        expect($record.get()).toEqual({
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
        const off = listen($record, rootListener)
        const offChild = listen($record.location, childListener)
        const offLeaf = listen($record.location.city, leafListener)

        expect(rootListener).not.toHaveBeenCalled()
        expect(childListener).not.toHaveBeenCalled()
        expect(leafListener).not.toHaveBeenCalled()

        $record.location.city.set('ბათუმი')

        expect(rootListener).toHaveBeenCalledTimes(1)
        expect(rootListener).toHaveBeenCalledWith({
          name: 'Dan Onoshko',
          location: {
            city: 'ბათუმი',
            country: 'Georgia'
          }
        }, {
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        }, {})
        expect(childListener).toHaveBeenCalledTimes(1)
        expect(childListener).toHaveBeenCalledWith({
          city: 'ბათუმი',
          country: 'Georgia'
        }, {
          city: 'Batumi',
          country: 'Georgia'
        }, {})
        expect(leafListener).toHaveBeenCalledTimes(1)
        expect(leafListener).toHaveBeenCalledWith('ბათუმი', 'Batumi', {})

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

        expect($record.location.city.get()).toBe('Batumi')

        update($record, data => ({
          ...data,
          location: {
            ...data.location,
            city: 'ბათუმი'
          }
        }))

        expect($record.location.city.get()).toBe('ბათუმი')
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
        const off = listen($record, rootListener)
        const offChild = listen($record.location, childListener)
        const offLeaf = listen($record.location.city, leafListener)

        expect(rootListener).not.toHaveBeenCalled()
        expect(childListener).not.toHaveBeenCalled()
        expect(leafListener).not.toHaveBeenCalled()

        expect($record.location.city.get()).toBe('Batumi')

        update($record, data => ({
          ...data,
          location: {
            ...data.location,
            city: 'ბათუმი'
          }
        }))

        expect(rootListener).toHaveBeenCalledTimes(1)
        expect(rootListener).toHaveBeenCalledWith({
          name: 'Dan Onoshko',
          location: {
            city: 'ბათუმი',
            country: 'Georgia'
          }
        }, {
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        }, {})
        expect(childListener).toHaveBeenCalledTimes(1)
        expect(childListener).toHaveBeenCalledWith({
          city: 'ბათუმი',
          country: 'Georgia'
        }, {
          city: 'Batumi',
          country: 'Georgia'
        }, {})
        expect(leafListener).toHaveBeenCalledTimes(1)
        expect(leafListener).toHaveBeenCalledWith('ბათუმი', 'Batumi', {})

        off()
        offChild()
        offLeaf()
      })

      it('should create record store from other store', () => {
        const $city = atom('Batumi')
        const $record = deepRecord(computed($city, city => ({
          name: 'Dan Onoshko',
          location: {
            city,
            country: 'Georgia'
          }
        })))

        expect($record.get()).toEqual({
          name: 'Dan Onoshko',
          location: {
            city: 'Batumi',
            country: 'Georgia'
          }
        })
        expect($record.location.city.get()).toBe('Batumi')

        $city.set('ბათუმი')

        expect($record.get()).toEqual({
          name: 'Dan Onoshko',
          location: {
            city: 'ბათუმი',
            country: 'Georgia'
          }
        })
        expect($record.location.city.get()).toBe('ბათუმი')
      })
    })
  })
})
