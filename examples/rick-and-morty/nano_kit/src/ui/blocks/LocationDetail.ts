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
import { $location } from '#src/stores/locations'

export const LocationDetail = component$(() => if_($location)(
  (location) => {
    const $location = record(location)

    return div({
      class: 'location-detail-container'
    })(
      div({
        class: 'location-detail-header'
      })(
        div({
          class: 'location-detail-info'
        })(
          h1({
            class: 'location-detail-name'
          })(
            $location.$name
          ),
          div({
            class: 'location-detail-type'
          })(
            span({
              class: 'location-detail-label'
            })(
              'Type:'
            ),
            span({
              class: 'location-detail-value'
            })(
              $location.$type
            )
          ),
          div({
            class: 'location-detail-dimension'
          })(
            span({
              class: 'location-detail-label'
            })(
              'Dimension:'
            ),
            span({
              class: 'location-detail-value'
            })(
              $location.$dimension
            )
          )
        )
      ),
      div({
        class: 'location-detail-details'
      })(
        div({
          class: 'location-detail-section'
        })(
          h2()(
            'Created'
          ),
          p()(
            () => new Date($location().created).toLocaleDateString()
          )
        ),
        div({
          class: 'location-detail-section'
        })(
          h2()(
            'URL'
          ),
          p()(
            'Location #', $location.$id
          )
        )
      )
    )
  }
))
