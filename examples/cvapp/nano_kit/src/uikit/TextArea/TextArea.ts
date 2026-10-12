import {
  type Signalish,
  $get,
  signal
} from 'nanoviews/store'
import {
  type Attributes,
  textarea,
  component$,
  effect$
} from 'nanoviews'
import typography from '../typography.module.css'
import mixins from '../mixins.module.css'
import styles from './TextArea.module.css'

export interface TextAreaProps extends Attributes<'textarea'> {
  maxLength?: Signalish<number>
  value?: Signalish<string>
}

export const TextArea = component$(({
  class: className,
  maxLength = Infinity,
  value = '',
  ...props
}: TextAreaProps) => {
  const $textarea = signal<HTMLTextAreaElement | null>(null)

  // Unlike the `maxlength` attribute, which cuts a longer text short, the
  // limit lets it in and makes the control invalid
  effect$(() => {
    const max = $get(maxLength)

    $textarea()?.setCustomValidity(
      $get(value).length > max ? `Maximum length is ${max} characters` : ''
    )
  })

  return textarea({
    ref: $textarea,
    class: [
      styles.root,
      typography.text,
      typography.md,
      mixins.focusOutline,
      className
    ],
    value,
    ...props
  })
})
