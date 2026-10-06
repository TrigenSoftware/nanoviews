/* DISCLAIMER! VIBECODED! */
import type { Accessor } from 'nanoviews/store'
import {
  div,
  trackById,
  component$,
  for_
} from 'nanoviews'
import type { Character } from '#src/services/api'
import { CharacterCard } from '#src/ui/blocks/CharacterCard'

export interface CharactersGridProps {
  $characters: Accessor<Character[] | null | undefined>
}

export const CharactersGrid = component$(({ $characters }: CharactersGridProps) => div({
  class: 'characters-grid-grid'
})(
  for_($characters, trackById)(
    $character => CharacterCard({
      $character
    })
  )
))
