import { signal } from 'nanoviews/store'
import {
  button,
  component$
} from 'nanoviews'

export const Counter = component$(() => {
  const $count = signal(0)

  return button({
    onClick() {
      $count(count => count + 1)
    }
  })(
    'count is ', $count
  )
})
