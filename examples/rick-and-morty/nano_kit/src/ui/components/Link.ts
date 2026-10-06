import {
  type UnknownMatchRef,
  linkComponent,
  preloadable,
  ariaCurrent
} from '@nanoviews/router'
import {
  $location,
  navigation,
  paths
} from '#src/stores/router'
import { pages } from '#src/pages'

export const Link = linkComponent(navigation, paths, [
  // Typed, so that the type of the pages does not wait for the layout, which renders links
  preloadable((): UnknownMatchRef[] => pages, true),
  ariaCurrent($location)
])
