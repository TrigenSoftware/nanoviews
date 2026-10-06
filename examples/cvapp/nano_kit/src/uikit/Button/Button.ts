import {
  type EmptyValue,
  type Signalish,
  pick
} from 'nanoviews/store'
import {
  type ComponentInstance,
  type ElementName,
  button,
  span,
  component$,
  swap_
} from 'nanoviews'
import type { AsElementProps } from '../types'
import {
  type IconName,
  Icon
} from '../Icon'
import typography from '../typography.module.css'
import mixins from '../mixins.module.css'
import styles from './Button.module.css'

interface BaseButtonProps {
  variant?: Signalish<'default' | 'primary' | 'subtle'>
  size?: 'sm' | 'md' | 'lg'
  color?: 'danger'
  block?: boolean
  icon?: Signalish<IconName | EmptyValue>
  iconAlign?: 'left' | 'right'
}

export type ButtonProps<T extends ElementName = 'button'> = BaseButtonProps & AsElementProps<T>

// The render is typed for the default element, the signature for the element
// a caller passes in `as`, with its attributes
export const Button = component$((
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
    styles[size],
    color && styles[color],
    block && styles.block,
    typography.text,
    typography[size],
    mixins.focusOutline,
    className
  ],
  ...props
})(
  swap_(icon, name => name && span({
    class: `${styles.icon} ${styles[iconAlign]}`
  })(
    Icon({
      name
    })
  )),
  // The children stand in the flex row as they are: a text gets a box of its
  // own while it is not empty, and an element is there for the styles to reach
  ...children
)) as <T extends ElementName = 'button'>(props?: ButtonProps<T>) => ComponentInstance
