import {
  describe,
  it,
  expect
} from 'vitest'
import { hydrate } from './hydrate.js'

describe('server', () => {
  describe('hydrate', () => {
    it('should throw in the server bundle', () => {
      expect(() => hydrate(() => 'App', {} as ParentNode)).toThrow('hydrate works in the client bundle only, the server renders an app with renderToString')
    })
  })
})
