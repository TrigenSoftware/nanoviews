import {
  type Attributes,
  input,
  component$
} from 'nanoviews'
import typography from '../typography.module.css'
import mixins from '../mixins.module.css'
import styles from './TextInput.module.css'

export interface TextInputProps extends Attributes<'input'> {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
}

export const TextInput = component$(({
  class: className,
  type = 'text',
  ...props
}: TextInputProps) => input({
  type,
  class: [
    styles.root,
    typography.text,
    typography.md,
    mixins.focusOutline,
    className
  ],
  ...props
}))
