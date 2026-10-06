/* DISCLAIMER! VIBECODED! */
import {
  type Accessor,
  deepRecord
} from 'nanoviews/store'
import {
  article,
  div,
  h2,
  span,
  component$
} from 'nanoviews'
import type { Episode } from '#src/services/api'
import { Link } from '#src/ui/components/Link'

export interface EpisodeCardProps {
  $episode: Accessor<Episode>
}

export const EpisodeCard = component$(({ $episode: episode }: EpisodeCardProps) => {
  const $episode = deepRecord(episode)

  return article({
    class: 'episode-card-card'
  })(
    Link({
      to: 'episode',
      params: {
        // A card is a row tracked by id, so the id never changes in it
        id: $episode().id
      },
      class: 'episode-card-link'
    })(
      div({
        class: 'episode-card-content'
      })(
        h2({
          class: 'episode-card-name'
        })(
          $episode.$name
        ),
        div({
          class: 'episode-card-info'
        })(
          div({
            class: 'episode-card-row'
          })(
            span({
              class: 'episode-card-label'
            })(
              'Episode:'
            ),
            span({
              class: 'episode-card-value'
            })(
              $episode.$episode
            )
          ),
          div({
            class: 'episode-card-row'
          })(
            span({
              class: 'episode-card-label'
            })(
              'Air Date:'
            ),
            span({
              class: 'episode-card-value'
            })(
              $episode.$air_date
            )
          ),
          div({
            class: 'episode-card-row'
          })(
            span({
              class: 'episode-card-label'
            })(
              'Characters:'
            ),
            span({
              class: 'episode-card-value'
            })(
              $episode.$characters.$length
            )
          )
        )
      )
    )
  )
})
