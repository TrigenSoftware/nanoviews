import {
  type Attributes,
  div,
  component$
} from 'nanoviews'
import typography from '../typography.module.css'
import styles from './ErrorMessage.module.css'

export interface ErrorMessageProps extends Attributes<'div'> {}

export const ErrorMessage = component$((
  {
    class: className,
    ...props
  }: ErrorMessageProps,
  children
) => div({
  'class': [
    styles.root,
    typography.text,
    typography.sm,
    className
  ],
  'aria-live': 'polite',
  ...props
})(
  ...children
))
