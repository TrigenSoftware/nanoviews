import {
  describe,
  it,
  expect
} from 'vitest'
import { div } from './elements/index.js'
import { renderToString } from './renderToString.js'

describe('nanoviews', () => {
  describe('renderToString', () => {
    it('should throw in the client bundle', () => {
      expect(() => renderToString(() => div()(
        'App'
      ))).toThrow('renderToString works in the server bundle only, where @nanoviews/server stands in for nanoviews')
    })
  })
})
