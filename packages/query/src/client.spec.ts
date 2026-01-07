import {
  describe,
  it,
  expect
} from 'vitest'
import type { QueryClientContext } from './ClientContext.js'
import { queryKey } from './cache.js'
import {
  type ClientExtension,
  client
} from './client.js'

describe('query', () => {
  describe('client', () => {
    it('should apply settings to context', () => {
      let value

      client(
        (ctx: QueryClientContext) => ctx.cacheTime = 1234,
        (ctx: QueryClientContext) => value = ctx.cacheTime
      )

      expect(value).toBe(1234)
    })

    it('should apply extension', () => {
      interface MethodsExtension {
        method: typeof method
      }

      const method = () => 321
      const methods = ((_, client) => {
        (client as MethodsExtension).method = method

        return client
      }) as ClientExtension<MethodsExtension>
      const { method: m } = client(methods)

      expect(m()).toBe(321)
    })

    it('should provide data cache facade', () => {
      const { $data } = client()
      const key = queryKey<[string], string>('test')('a')

      expect($data(key)).toBe(null)

      $data(key, 'value')

      expect($data(key)).toBe('value')
    })
  })
})
