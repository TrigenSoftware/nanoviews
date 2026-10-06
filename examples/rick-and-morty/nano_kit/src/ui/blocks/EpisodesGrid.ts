/* DISCLAIMER! VIBECODED! */
import type { Accessor } from 'nanoviews/store'
import {
  div,
  trackById,
  component$,
  for_
} from 'nanoviews'
import type { Episode } from '#src/services/api'
import { EpisodeCard } from '#src/ui/blocks/EpisodeCard'

export interface EpisodesGridProps {
  $episodes: Accessor<Episode[] | null | undefined>
}

export const EpisodesGrid = component$(({ $episodes }: EpisodesGridProps) => div({
  class: 'episodes-grid-grid'
})(
  for_($episodes, trackById)(
    $episode => EpisodeCard({
      $episode
    })
  )
))
