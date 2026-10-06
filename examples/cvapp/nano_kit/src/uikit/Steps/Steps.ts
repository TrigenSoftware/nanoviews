import {
  type Signalish,
  lt,
  when
} from 'nanoviews/store'
import {
  type Attributes,
  div,
  component$
} from 'nanoviews'
import styles from './Steps.module.css'

export interface StepsProps extends Attributes<'div'> {
  value: Signalish<number>
  max: number
  size?: 'md' | 'lg'
}

export const Steps = component$(({
  class: className,
  value,
  max,
  size = 'md',
  ...props
}: StepsProps) => div({
  'class': [
    styles.root,
    styles[size],
    className
  ],
  'aria-hidden': 'true',
  ...props
})(
  ...Array.from(
    {
      length: max
    },
    (_, index) => div({
      class: [
        styles.step,
        when(lt(index, value), styles.filled)
      ]
    })
  )
))
