import {
  type Attributes,
  div,
  component$
} from 'nanoviews'
import styles from './LetterCard.module.css'

export interface LetterCardFooterProps extends Attributes<'div'> {}

export const LetterCardFooter = component$((
  {
    class: className,
    ...props
  }: LetterCardFooterProps,
  children
) => div({
  class: [
    styles.footer,
    className
  ],
  ...props
})(
  ...children
))
