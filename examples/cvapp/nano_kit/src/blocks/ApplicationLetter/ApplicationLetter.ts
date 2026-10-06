import {
  computed,
  or,
  when
} from 'nanoviews/store'
import {
  div,
  component$,
  if_
} from 'nanoviews'
import {
  $currentApplication,
  $upsertApplicationLoading
} from '~/stores/application'
import { textBlink } from '~/uikit/hooks'
import {
  type LetterCardProps,
  LetterCard
} from '~/uikit/LetterCard'
import { LetterCardContent } from '~/uikit/LetterCard/LetterCardContent'
import { LetterCardFooter } from '~/uikit/LetterCard/LetterCardFooter'
import { Button } from '~/uikit/Button'
import { Thinker } from '~/uikit/Thinker'
import { BLINK_DURATION } from '~/constants'
import styles from './ApplicationLetter.module.css'

export interface ApplicationLetterProps extends LetterCardProps {}

export const ApplicationLetter = component$(({
  class: className,
  ...props
}: ApplicationLetterProps) => {
  const $letter = computed(() => $currentApplication()?.letter)
  const $hidden = when($upsertApplicationLoading, styles.hidden)
  const [$copiedText, copied] = textBlink('Copied!', BLINK_DURATION)
  const onCopyCallback = () => {
    void navigator.clipboard
      .writeText($letter()!)
      .then(copied)
  }

  return LetterCard({
    class: [styles.root, className],
    ...props
  })(
    if_($upsertApplicationLoading)(
      () => div({
        class: styles.loader
      })(
        Thinker({
          label: 'Loading...'
        })
      )
    ),
    LetterCardContent({
      class: [styles.content, $hidden],
      placeholder: 'Your personalized job application will appear here...',
      value: $letter
    }),
    LetterCardFooter({
      class: [styles.footer, $hidden]
    })(
      if_($letter)(
        () => Button({
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
  )
})
