import {
  type EmptyValue,
  type Signalish,
  or
} from 'nanoviews/store'
import {
  type Attributes,
  div,
  component$
} from 'nanoviews'
import mixins from '../mixins.module.css'
import styles from './LetterCard.module.css'

export interface LetterCardContentProps extends Attributes<'div'> {
  placeholder?: string
  value?: Signalish<string | EmptyValue>
  maxLines?: number
}

export const LetterCardContent = component$(({
  class: className,
  value,
  placeholder,
  maxLines,
  ...props
}: LetterCardContentProps) => div({
  class: [
    styles.content,
    maxLines && styles.maxLines,
    mixins.focusOutline,
    className
  ],
  style: {
    '--countLinesMax': maxLines
  },
  ...props
})(
  // One text node: the styles break its lines
  or(value, placeholder)
))
