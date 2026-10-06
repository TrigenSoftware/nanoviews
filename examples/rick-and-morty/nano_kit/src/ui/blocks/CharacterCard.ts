/* DISCLAIMER! VIBECODED! */
import {
  type Accessor,
  deepRecord
} from 'nanoviews/store'
import {
  article,
  div,
  img,
  h2,
  span,
  component$
} from 'nanoviews'
import type { Character } from '#src/services/api'
import { Link } from '#src/ui/components/Link'

export interface CharacterCardProps {
  $character: Accessor<Character>
}

export const CharacterCard = component$(({ $character: character }: CharacterCardProps) => {
  const $character = deepRecord(character)

  return article({
    class: 'character-card-card'
  })(
    Link({
      to: 'character',
      params: {
        // A card is a row tracked by id, so the id never changes in it
        id: $character().id
      },
      class: 'character-card-link'
    })(
      div({
        class: 'character-card-image-wrapper'
      })(
        img({
          src: $character.$image,
          alt: $character.$name,
          class: 'character-card-image',
          loading: 'lazy'
        })
      ),
      div({
        class: 'character-card-content'
      })(
        h2({
          class: 'character-card-name'
        })(
          $character.$name
        ),
        div({
          class: 'character-card-info'
        })(
          div({
            class: 'character-card-row'
          })(
            span({
              class: 'character-card-label'
            })(
              'Status:'
            ),
            span({
              class: ['character-card-status', () => `character-card-status--${$character.$status().toLowerCase()}`]
            })(
              $character.$status
            )
          ),
          div({
            class: 'character-card-row'
          })(
            span({
              class: 'character-card-label'
            })(
              'Species:'
            ),
            span({
              class: 'character-card-value'
            })(
              $character.$species
            )
          ),
          div({
            class: 'character-card-row'
          })(
            span({
              class: 'character-card-label'
            })(
              'Gender:'
            ),
            span({
              class: 'character-card-value'
            })(
              $character.$gender
            )
          ),
          div({
            class: 'character-card-row'
          })(
            span({
              class: 'character-card-label'
            })(
              'Origin:'
            ),
            span({
              class: 'character-card-value'
            })(
              $character.$origin.$name
            )
          ),
          div({
            class: 'character-card-row'
          })(
            span({
              class: 'character-card-label'
            })(
              'Location:'
            ),
            span({
              class: 'character-card-value'
            })(
              $character.$location.$name
            )
          ),
          div({
            class: 'character-card-row'
          })(
            span({
              class: 'character-card-label'
            })(
              'Episodes:'
            ),
            span({
              class: 'character-card-value'
            })(
              $character.$episode.$length
            )
          )
        )
      )
    )
  )
})
