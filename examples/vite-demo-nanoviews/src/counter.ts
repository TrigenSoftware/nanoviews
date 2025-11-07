import { signal } from 'nanoviews/store'
import { button } from 'nanoviews'

export function Counter() {
  const $count = signal(0)

  return button({
    onClick() {
      $count(count => count + 1)
    }
  })(
    'count is ', $count
  )
}
