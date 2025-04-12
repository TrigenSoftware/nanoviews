import { task } from 'nanostores'

export function channel() {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let abort = () => {}

  return <T = void>(fn: (signal: AbortSignal) => Promise<T>) => task(async () => {
    abort()

    const ac = new AbortController()
    const promise = fn(ac.signal)

    abort = () => ac.abort()

    try {
      await promise
    } catch (err) {
      if (!ac.signal.aborted) {
        throw err
      }
    }
  })
}
