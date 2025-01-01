import { signal } from 'nanoviews/store'
import { button } from 'nanoviews'

export function Counter() {
  const $counter = signal(0)

  return button({
    id: 'counter',
    type: 'button',
    onClick() {
      $counter.set($counter.get() + 1)
    }
  })(
    'count is ', $counter
  )
}
