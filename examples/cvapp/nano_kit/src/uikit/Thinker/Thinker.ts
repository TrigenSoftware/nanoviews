import type { Signalish } from 'nanoviews/store'
import {
  type Attributes,
  div,
  component$
} from 'nanoviews'
import styles from './Thinker.module.css'

export interface ThinkerProps extends Attributes<'div'> {
  label: Signalish<string>
}

export const Thinker = component$(({
  class: className,
  label,
  ...props
}: ThinkerProps) => div({
  'class': [
    styles.root,
    className
  ],
  'role': 'status',
  'aria-label': label,
  ...props
})(
  div({
    class: styles.blur
  }),
  div({
    class: styles.sphere
  })
))
