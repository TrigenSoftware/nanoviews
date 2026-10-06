import {
  type Attributes,
  type Child,
  div,
  label,
  component$
} from 'nanoviews'
import typography from '../typography.module.css'
import styles from './FormGroup.module.css'

export interface FormGroupProps extends Attributes<'div'> {
  controlId?: string
  label?: Child
  description?: Child
}

export const FormGroup = component$((
  {
    class: className,
    controlId,
    label: labelContent,
    description,
    ...props
  }: FormGroupProps,
  children
) => div({
  class: [
    styles.root,
    className
  ],
  ...props
})(
  labelContent && label({
    for: controlId,
    class: `${styles.label} ${typography.text} ${typography.sm}`
  })(
    labelContent
  ),
  ...children,
  description && div({
    id: controlId && `${controlId}-description`,
    class: `${styles.description} ${typography.text} ${typography.sm}`
  })(
    description
  )
))
