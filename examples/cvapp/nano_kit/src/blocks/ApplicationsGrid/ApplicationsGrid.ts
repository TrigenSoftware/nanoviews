import {
  trackById,
  component$,
  for_
} from 'nanoviews'
import { $applications } from '~/stores/application'
import {
  type LetterCardGridProps,
  LetterCardGrid
} from '~/uikit/LetterCardGrid'
import { ApplicationCard } from '~/blocks/ApplicationCard'

export interface ApplicationsGridProps extends LetterCardGridProps {}

export const ApplicationsGrid = component$((props: ApplicationsGridProps) => LetterCardGrid(props)(
  for_($applications, trackById)(
    $application => ApplicationCard({
      $application
    })
  )
))
