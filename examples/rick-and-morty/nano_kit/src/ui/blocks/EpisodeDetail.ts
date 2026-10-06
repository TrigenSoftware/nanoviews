/* DISCLAIMER! VIBECODED! */
import { record } from 'nanoviews/store'
import {
  div,
  h1,
  h2,
  p,
  span,
  component$,
  if_
} from 'nanoviews'
import { $episode } from '#src/stores/episodes'

export const EpisodeDetail = component$(() => if_($episode)(
  (episode) => {
    const $episode = record(episode)

    return div({
      class: 'episode-detail-container'
    })(
      div({
        class: 'episode-detail-header'
      })(
        div({
          class: 'episode-detail-info'
        })(
          h1({
            class: 'episode-detail-name'
          })(
            $episode.$name
          ),
          div({
            class: 'episode-detail-episode'
          })(
            span({
              class: 'episode-detail-label'
            })(
              'Episode:'
            ),
            span({
              class: 'episode-detail-value'
            })(
              $episode.$episode
            )
          ),
          div({
            class: 'episode-detail-air-date'
          })(
            span({
              class: 'episode-detail-label'
            })(
              'Air Date:'
            ),
            span({
              class: 'episode-detail-value'
            })(
              $episode.$air_date
            )
          )
        )
      ),
      div({
        class: 'episode-detail-details'
      })(
        div({
          class: 'episode-detail-section'
        })(
          h2()(
            'Created'
          ),
          p()(
            () => new Date($episode().created).toLocaleDateString()
          )
        ),
        div({
          class: 'episode-detail-section'
        })(
          h2()(
            'URL'
          ),
          p()(
            'Episode #', $episode.$id
          )
        )
      )
    )
  }
))
