import {
  describe,
  it,
  expect
} from 'vitest'
import { p } from './elements/elements.js'
import { fragment } from './elements/fragment.js'
import { mount } from './mount.js'

describe('nanoviews', () => {
  describe('mount', () => {
    it('should remove the nodes of a fragment on unmount', () => {
      const target = document.createElement('div')
      const unmount = mount(() => fragment(
        p()(
          'a'
        ),
        'b'
      ), target)

      expect(target.innerHTML).toBe('<p>a</p>b')

      unmount()

      expect(target.innerHTML).toBe('')
    })

    it('should unmount a fragment whose children render nothing', () => {
      const target = document.createElement('div')
      const unmount = mount(() => fragment(
        null,
        false
      ), target)

      expect(unmount).not.toThrow()
      expect(target.innerHTML).toBe('')
    })
  })
})
