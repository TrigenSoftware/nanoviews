/* DISCLAIMER! VIBECODED! */
import type { Accessor } from 'nanoviews/store'
import {
  div,
  trackById,
  component$,
  for_
} from 'nanoviews'
import type { Location } from '#src/services/api'
import { LocationCard } from '#src/ui/blocks/LocationCard'

export interface LocationsGridProps {
  $locations: Accessor<Location[] | null | undefined>
}

export const LocationsGrid = component$(({ $locations }: LocationsGridProps) => div({
  class: 'locations-grid-grid'
})(
  for_($locations, trackById)(
    $location => LocationCard({
      $location
    })
  )
))
