import {
  type EmptyValue,
  type Signalish,
  pick
} from 'nanoviews/store'
import {
  type PolymorphicProps,
  div,
  polymorphic$
} from 'nanoviews'
import typography from '../typography.module.css'
import styles from './Paper.module.css'

export interface PaperProps extends PolymorphicProps<'div', 'section' | 'article' | 'aside'> {
  color?: Signalish<'success' | EmptyValue>
}

export const Paper = polymorphic$((
  {
    as = div,
    class: className,
    color,
    ...props
  }: PaperProps,
  children
) => as({
  class: [
    styles.root,
    pick(styles, color),
    typography.text,
    typography.lg,
    className
  ],
  ...props
})(
  ...children
))
