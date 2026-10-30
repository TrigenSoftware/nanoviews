import {
  describe,
  it,
  expect
} from 'vitest'
import {
  div,
  span
} from './elements.js'
import { renderToString } from '../renderToString.js'
import { portal } from './portal.js'

describe('server', () => {
  describe('elements', () => {
    describe('portal', () => {
      it('should write nothing and leave the target alone', () => {
        let targets = 0

        expect(renderToString(() => div()(
          'before',
          portal(
            () => {
              targets++

              return {} as ParentNode
            },
            span()(
              'portal'
            )
          ),
          'after'
        ))).toBe('<div>beforeafter</div>')
        expect(targets).toBe(0)
      })
    })
  })
})
