import {
  gte,
  lte,
  text
} from 'nanoviews/store'
import {
  type Attributes,
  div,
  span,
  component$,
  if_
} from 'nanoviews'
import typography from '~/uikit/typography.module.css'
import { $applicationCount } from '~/stores/application'
import { GOAL_APPLICATIONS } from '~/constants'
import { Steps } from '~/uikit/Steps'
import { Icon } from '~/uikit/Icon'
import styles from './ApplicationsProgress.module.css'

export interface ApplicationsProgressProps extends Attributes<'div'> {}

export const ApplicationsProgress = component$(({
  class: className,
  ...props
}: ApplicationsProgressProps) => {
  const $text = text`${$applicationCount}/${GOAL_APPLICATIONS} applications generated`

  return if_(lte($applicationCount, GOAL_APPLICATIONS))(
    () => div({
      'class': [styles.root, className],
      'role': 'status',
      'aria-label': $text,
      ...props
    })(
      span({
        'class': `${typography.text} ${typography.lg} ${styles.text}`,
        'aria-hidden': 'true'
      })(
        $text
      ),
      if_(gte($applicationCount, GOAL_APPLICATIONS))(
        () => Icon({
          class: styles.icon,
          name: 'check'
        }),
        () => Steps({
          max: GOAL_APPLICATIONS,
          size: 'md',
          value: $applicationCount
        })
      )
    )
  )
})
