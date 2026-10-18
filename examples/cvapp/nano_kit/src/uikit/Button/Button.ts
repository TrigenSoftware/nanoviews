import {
  type EmptyValue,
  type Signalish,
  pick,
  when
} from 'nanoviews/store'
import {
  type PolymorphicProps,
  button,
  span,
  polymorphic$,
  swap_
} from 'nanoviews'
import {
  type IconName,
  Icon
} from '../Icon'
import typography from '../typography.module.css'
import mixins from '../mixins.module.css'
import styles from './Button.module.css'

export interface ButtonProps extends PolymorphicProps<'button'> {
  variant?: Signalish<'default' | 'primary' | 'subtle'>
  size?: Signalish<'sm' | 'md' | 'lg'>
  color?: Signalish<'danger' | EmptyValue>
  block?: Signalish<boolean>
  icon?: Signalish<IconName | EmptyValue>
  iconAlign?: Signalish<'left' | 'right'>
}

export const Button = polymorphic$((
  {
    as = button,
    class: className,
    variant = 'default',
    size = 'md',
    color,
    block,
    icon,
    iconAlign = 'left',
    ...props
  }: ButtonProps,
  children
) => as({
  class: [
    styles.root,
    pick(styles, variant),
    pick(styles, size),
    pick(styles, color),
    when(block, styles.block),
    typography.text,
    pick(typography, size),
    mixins.focusOutline,
    className
  ],
  ...props
})(
  swap_(icon, name => name && span({
    class: [
      styles.icon,
      pick(styles, iconAlign)
    ]
  })(
    Icon({
      name
    })
  )),
  // The children stand in the flex row as they are: a text gets a box of its
  // own while it is not empty, and an element is there for the styles to reach
  ...children
))
