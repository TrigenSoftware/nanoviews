import {
  type Accessor,
  signal
} from 'nanoviews/store'
import { effect$ } from 'nanoviews'

/**
 * Follows the validity of a form by calling its checkValidity method.
 * The data is followed instead of the input events: it changes on input and on a write from code alike.
 * @param $form - A signal of the form element to check.
 * @param $data - The data the form controls show.
 * @returns A signal of whether the form is currently valid.
 */
export function formValidity$(
  $form: Accessor<HTMLFormElement | null>,
  $data: Accessor<unknown>
) {
  const $valid = signal(false)

  effect$(() => {
    // Checked a task later, once every control shows the new data
    const timer = setTimeout(() => $valid($form()!.checkValidity()))

    $data()

    return () => clearTimeout(timer)
  })

  return $valid
}

/**
 * Shows the given text for a specified duration, then hides it.
 * @param text - The text to show.
 * @param duration - The duration in milliseconds to show the text.
 * @returns A signal of the current text (or undefined if hidden) and a function to trigger the blink.
 */
export function textBlink(text: string, duration: number) {
  const $text = signal<string>()
  let timeout: ReturnType<typeof setTimeout> | undefined

  return [
    $text,
    () => {
      clearTimeout(timeout)
      $text(text)
      timeout = setTimeout(() => $text(undefined), duration)
    }
  ] as const
}
