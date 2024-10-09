import {
  describe,
  it,
  expect
} from 'vitest'
import { render } from '@nanoviews/testing-library'
import { atom } from '@nanoviews/stores'
import { button } from './elements.js'
import { ref$ } from './ref.js'

describe('nanoviews', () => {
  describe('elements', () => {
    describe('ref$', () => {
      it('should set ref', () => {
        const ref = atom<HTMLButtonElement | null>(null)

        render(button({
          [ref$]: ref
        })('Click me!'))

        expect(ref.get()).toBeInstanceOf(HTMLButtonElement)
      })
    })
  })
})
