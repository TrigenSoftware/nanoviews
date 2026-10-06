import {
  type HTMLAttributes,
  div,
  component$
} from 'nanoviews'
import styles from './LetterCardGrid.module.css'

export interface LetterCardGridProps extends HTMLAttributes<HTMLElement> {}

export const LetterCardGrid = component$((
  {
    class: className,
    ...props
  }: LetterCardGridProps,
  children
) => div({
  class: [
    styles.root,
    className
  ],
  role: 'list',
  ...props
})(
  ...children
))
