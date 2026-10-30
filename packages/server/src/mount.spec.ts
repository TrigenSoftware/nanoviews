import {
  describe,
  it,
  expect
} from 'vitest'
import { mount } from './mount.js'

describe('server', () => {
  describe('mount', () => {
    it('should throw in the server bundle', () => {
      expect(() => mount(() => 'App', {} as ParentNode)).toThrow('mount works in the client bundle only, the server renders an app with renderToString')
    })
  })
})
