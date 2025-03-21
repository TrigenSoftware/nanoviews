import {
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect
} from 'vitest'
import {
  effect,
  signal
} from 'agera'
import { debounce } from './utils.js'
import { paced } from './paced.js'

describe('kida', () => {
  describe('paced', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should pace signal update', () => {
      const $paced = paced(signal(0), debounce(300))
      const listener = vi.fn()
      const off = effect(() => {
        listener($paced())
      })

      expect($paced()).toBe(0)
      expect(listener).toHaveBeenCalledTimes(1)

      $paced(1)
      vi.advanceTimersByTime(100)
      $paced(2)
      vi.advanceTimersByTime(100)
      $paced(3)
      vi.advanceTimersByTime(300)

      expect($paced()).toBe(3)
      expect(listener).toHaveBeenCalledTimes(2)

      off()
    })
  })
})
