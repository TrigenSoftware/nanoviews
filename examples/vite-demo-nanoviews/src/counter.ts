import { atom } from '@nanoviews/stores'
import {
  component$,
  button
} from 'nanoviews'

export const Counter = component$(() => {
  const $counter = atom(0)

  return button({
    id: 'counter',
    type: 'button',
    onClick() {
      $counter.set($counter.get() + 1)
    }
  })(
    'count is ', $counter
  )
})
