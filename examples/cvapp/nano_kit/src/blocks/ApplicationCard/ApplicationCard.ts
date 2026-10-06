import {
  type Accessor,
  or,
  pick
} from 'nanoviews/store'
import {
  a,
  component$
} from 'nanoviews'
import type { Application } from '~/services/application.types'
import { deleteApplication } from '~/stores/application'
import { paths } from '~/stores/router'
import { textBlink } from '~/uikit/hooks'
import mixins from '~/uikit/mixins.module.css'
import {
  type LetterCardProps,
  LetterCard
} from '~/uikit/LetterCard'
import { LetterCardContent } from '~/uikit/LetterCard/LetterCardContent'
import { LetterCardFooter } from '~/uikit/LetterCard/LetterCardFooter'
import { Button } from '~/uikit/Button'
import { BLINK_DURATION } from '~/constants'
import styles from './ApplicationCard.module.css'

export interface ApplicationCardProps extends LetterCardProps {
  $application: Accessor<Application>
}

export const ApplicationCard = component$(({
  $application,
  ...props
}: ApplicationCardProps) => {
  // A card is a row tracked by id, so its id never changes in it
  const { id } = $application()
  const [$copiedText, copied] = textBlink('Copied!', BLINK_DURATION)
  const onCopyCallback = () => {
    void navigator.clipboard
      .writeText($application().letter)
      .then(copied)
  }
  const onDeleteCallback = () => {
    // oxlint-disable-next-line no-alert
    if (confirm('Are you sure you want to delete this application letter?')) {
      void deleteApplication(id)
    }
  }

  return LetterCard(props)(
    a({
      'class': `${styles.link} ${mixins.focusOutline}`,
      'href': paths.application({
        id
      }),
      'aria-label': 'View application details'
    })(
      LetterCardContent({
        maxLines: 6,
        value: pick($application, 'letter')
      })
    ),
    LetterCardFooter()(
      Button({
        icon: 'trash',
        size: 'sm',
        variant: 'subtle',
        color: 'danger',
        onClick: onDeleteCallback
      })(
        'Delete'
      ),
      Button({
        icon: 'copy',
        iconAlign: 'right',
        size: 'sm',
        variant: 'subtle',
        onClick: onCopyCallback
      })(
        or($copiedText, 'Copy to clipboard')
      )
    )
  )
})
