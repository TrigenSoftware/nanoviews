import {
  article,
  component$
} from 'nanoviews'
import {
  type PaperProps,
  Paper
} from '../Paper'
import styles from './LetterCard.module.css'

export interface LetterCardProps extends Omit<PaperProps<'article'>, 'color' | 'as'> {}

export const LetterCard = component$((
  {
    class: className,
    ...props
  }: LetterCardProps,
  children
) => Paper({
  as: article,
  class: [
    styles.root,
    className
  ],
  ...props
})(
  ...children
))
