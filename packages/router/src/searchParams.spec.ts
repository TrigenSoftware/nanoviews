import {
  describe,
  it,
  expect
} from 'vitest'
import { virtualNavigation } from './navigation.js'
import {
  searchParams,
  searchParam
} from './searchParams.js'

describe('router', () => {
  describe('searchParams', () => {
    it('should return URLSearchParams and react to search changes', () => {
      const [$location, navigation] = virtualNavigation()
      const $params = searchParams($location)

      expect($params()).toBeInstanceOf(URLSearchParams)
      expect($params().toString()).toBe('')

      navigation.push('/?a=1&b=2')

      expect($params().toString()).toBe('a=1&b=2')

      navigation.replace('/?b=3')

      expect($params().toString()).toBe('b=3')
    })

    it('should not recompute when only hash or pathname changes (search unchanged)', () => {
      const [$location, navigation] = virtualNavigation()
      const $params = searchParams($location)
      const first = $params()

      navigation.push('/#hash')
      expect($params()).toBe(first)

      navigation.replace('/path#hash2')
      expect($params()).toBe(first)
    })

    it('should recompute when search string changes', () => {
      const [$location, navigation] = virtualNavigation()
      const $params = searchParams($location)
      const first = $params()

      navigation.push('/?x=1')

      const second = $params()

      expect(second).not.toBe(first)
      expect(second.get('x')).toBe('1')
    })

    describe('searchParam', () => {
      it('should react location change', () => {
        const [$location, navigation] = virtualNavigation()
        const $params = searchParams($location)
        const $a = searchParam($params, 'a')

        expect($a()).toBeNull()

        navigation.push('/?a=123')
        expect($a()).toBe('123')

        navigation.replace('/')
        expect($a()).toBeNull()
      })

      it('should parse value', () => {
        const [$location, navigation] = virtualNavigation()
        const $params = searchParams($location)
        const $n = searchParam($params, 'n', v => (v === null ? -1 : parseInt(v, 10)))

        expect($n()).toBe(-1)

        navigation.push('/?n=42')
        expect($n()).toBe(42)

        navigation.replace('/')
        expect($n()).toBe(-1)
      })
    })
  })
})
