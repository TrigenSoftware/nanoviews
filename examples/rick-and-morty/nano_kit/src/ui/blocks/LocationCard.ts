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
import type { Location } from '#src/services/api'
import { Link } from '#src/ui/components/Link'

export interface LocationCardProps {
  $location: Accessor<Location>
}

export const LocationCard = component$(({ $location: location }: LocationCardProps) => {
  const $location = deepRecord(location)

  return article({
    class: 'location-card-card'
  })(
    Link({
      to: 'location',
      params: {
        // A card is a row tracked by id, so the id never changes in it
        id: $location().id
      },
      class: 'location-card-link'
    })(
      div({
        class: 'location-card-content'
      })(
        h2({
          class: 'location-card-name'
        })(
          $location.$name
        ),
        div({
          class: 'location-card-info'
        })(
          div({
            class: 'location-card-row'
          })(
            span({
              class: 'location-card-label'
            })(
              'Type:'
            ),
            span({
              class: 'location-card-value'
            })(
              $location.$type
            )
          ),
          div({
            class: 'location-card-row'
          })(
            span({
              class: 'location-card-label'
            })(
              'Dimension:'
            ),
            span({
              class: 'location-card-value'
            })(
              $location.$dimension
            )
          ),
          div({
            class: 'location-card-row'
          })(
            span({
              class: 'location-card-label'
            })(
              'Residents:'
            ),
            span({
              class: 'location-card-value'
            })(
              $location.$residents.$length
            )
          )
        )
      )
    )
  )
})
