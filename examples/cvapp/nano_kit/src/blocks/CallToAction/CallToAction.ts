import {
  and,
  isNot,
  lt
} from 'nanoviews/store'
import {
  a,
  aside,
  h2,
  p,
  div,
  component$,
  if_
} from 'nanoviews'
import { $applicationCount } from '~/stores/application'
import {
  paths,
  $location
} from '~/stores/router'
import { GOAL_APPLICATIONS } from '~/constants'
import {
  type PaperProps,
  Paper
} from '~/uikit/Paper'
import { Button } from '~/uikit/Button'
import { Steps } from '~/uikit/Steps'
import typography from '~/uikit/typography.module.css'
import styles from './CallToAction.module.css'

export interface CallToActionProps extends Omit<PaperProps<'aside'>, 'color' | 'as'> {}

export const CallToAction = component$(({
  class: className,
  ...props
}: CallToActionProps) => if_(and(lt($applicationCount, GOAL_APPLICATIONS), isNot($location.$route, 'newApplication')))(
  () => Paper({
    as: aside,
    class: [styles.root, className],
    color: 'success',
    ...props
  })(
    h2({
      class: typography.h2
    })(
      'Hit your goal'
    ),
    p({
      class: `${typography.text} ${typography.lg}`
    })(
      'Generate and send out couple more job applications today to get hired faster'
    ),
    Button({
      as: a,
      href: paths.newApplication,
      variant: 'primary',
      size: 'lg',
      icon: 'plus'
    })(
      'Create New'
    ),
    div({
      class: styles.steps
    })(
      Steps({
        size: 'lg',
        max: GOAL_APPLICATIONS,
        value: $applicationCount
      }),
      p({
        class: `${typography.text} ${typography.lg}`
      })(
        $applicationCount,
        ' out of ',
        GOAL_APPLICATIONS
      )
    )
  )
))
