import {
  type Attributes,
  article,
  component$
} from 'nanoviews'
import { Paper } from '../Paper'
import styles from './LetterCard.module.css'

export interface LetterCardProps extends Omit<Attributes<'article'>, 'color'> {}

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
