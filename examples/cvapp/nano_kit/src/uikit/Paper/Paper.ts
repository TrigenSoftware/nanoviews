import {
  type ComponentInstance,
  component$,
  div
} from 'nanoviews'
import type { AsElementProps } from '../types'
import typography from '../typography.module.css'
import styles from './Paper.module.css'

type PaperElement = 'div' | 'section' | 'article' | 'aside'

export type PaperProps<T extends PaperElement = 'div'> = AsElementProps<T> & {
  color?: 'success'
}

// The render is typed for the default element, the signature for the element
// a caller passes in `as`, with its attributes
export const Paper = component$((
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
    color && styles[color],
    typography.text,
    typography.lg,
    className
  ],
  ...props
})(
  ...children
)) as <T extends PaperElement = 'div'>(props?: PaperProps<T>) => ComponentInstance
