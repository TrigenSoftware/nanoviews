import {
  type AnySignal,
  type MaybeDestroy,
  onActivate,
  effect
} from 'agera'

/**
 * Listen to signal start.
 * @param $signal - The signal to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onStart(
  $signal: AnySignal,
  listener: () => void
) {
  return onActivate($signal, mounted => mounted && listener())
}

/**
 * Listen to signal stop.
 * @param $signal - The signal to listen to.
 * @param listener - The listener function.
 * @returns Function to stop listening.
 */
export function onStop(
  $signal: AnySignal,
  listener: () => void
) {
  return onActivate($signal, mounted => !mounted && listener())
}

export const STORE_UNMOUNT_DELAY = 1000

/**
 * Listen to signal mount and unmount.
 * @param $signal - The signal to listen to.
 * @param listener - The mount listener function that returns an unmount listener.
 * @returns Function to stop listening.
 */
export function onMount(
  $signal: AnySignal,
  listener: () => MaybeDestroy
) {
  let active = false
  let destroy: MaybeDestroy

  return onActivate($signal, (mounted) => {
    if (mounted) {
      if (!active) {
        destroy = listener()
        active = true
      }
    } else {
      setTimeout(() => {
        if (active) {
          destroy?.()
          active = false
        }
      }, STORE_UNMOUNT_DELAY)
    }
  })
}

/**
 * Start the signal and keep it alive.
 * @param $signal - The signal to keep alive.
 * @returns Function to stop keeping the signal alive.
 */
export function start($signal: AnySignal) {
  return effect(() => {
    $signal()
  })
}

/**
 * Start and stop the signal immediately if it's not started.
 * @param $signal - The signal to execute.
 * @returns The signal.
 */
export function exec<T extends AnySignal>($signal: T) {
  start($signal)()

  return $signal
}

