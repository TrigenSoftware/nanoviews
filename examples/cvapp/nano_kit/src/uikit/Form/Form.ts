import {
  type Attributes,
  form,
  component$
} from 'nanoviews'
import styles from './Form.module.css'

export interface FormProps extends Attributes<'form'> {}

export const Form = component$((
  {
    class: className,
    ...props
  }: FormProps,
  children
) => form({
  class: [
    styles.root,
    className
  ],
  ...props
})(
  ...children
))
