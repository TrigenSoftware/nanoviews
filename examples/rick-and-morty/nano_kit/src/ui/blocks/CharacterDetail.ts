/* DISCLAIMER! VIBECODED! */
import { deepRecord } from 'nanoviews/store'
import {
  div,
  img,
  h1,
  h2,
  p,
  span,
  component$,
  if_
} from 'nanoviews'
import { $character } from '#src/stores/characters'

export const CharacterDetail = component$(() => if_($character)(
  (character) => {
    const $character = deepRecord(character)

    return div({
      class: 'character-detail-container'
    })(
      div({
        class: 'character-detail-header'
      })(
        img({
          src: $character.$image,
          alt: $character.$name,
          class: 'character-detail-image'
        }),
        div({
          class: 'character-detail-info'
        })(
          h1({
            class: 'character-detail-name'
          })(
            $character.$name
          ),
          div({
            class: 'character-detail-status'
          })(
            span({
              class: () => `character-detail-status-indicator character-detail-${$character.$status()?.toLowerCase()}`
            }),
            $character.$status,
            ' - ',
            $character.$species
          ),
          if_($character.$type)(
            $type => p({
              class: 'character-detail-type'
            })(
              'Type: ', $type
            )
          ),
          p({
            class: 'character-detail-gender'
          })(
            'Gender: ', $character.$gender
          )
        )
      ),
      div({
        class: 'character-detail-details'
      })(
        div({
          class: 'character-detail-section'
        })(
          h2()(
            'Origin'
          ),
          p()(
            $character.$origin.$name
          )
        ),
        div({
          class: 'character-detail-section'
        })(
          h2()(
            'Last known location'
          ),
          p()(
            $character.$location.$name
          )
        ),
        div({
          class: 'character-detail-section'
        })(
          h2()(
            'Episodes'
          ),
          p()(
            $character.$episode.$length, ' episodes'
          )
        )
      )
    )
  }
))
