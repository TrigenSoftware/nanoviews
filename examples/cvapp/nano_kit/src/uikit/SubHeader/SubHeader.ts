import {
  type Attributes,
  type Child,
  header,
  div,
  component$
} from 'nanoviews'
import styles from './SubHeader.module.css'

export interface SubHeaderProps extends Omit<Attributes<'header'>, 'title'> {
  title: Child
}

export const SubHeader = component$((
  {
    class: className,
    title,
    ...props
  }: SubHeaderProps,
  children
) => header({
  class: [
    styles.root,
    className
  ],
  ...props
})(
  title,
  children.length > 0 && div({
    class: styles.actions
  })(
    ...children
  )
))
