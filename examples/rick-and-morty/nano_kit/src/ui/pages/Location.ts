/* DISCLAIMER! VIBECODED! */
import {
  not,
  or
} from 'nanoviews/store'
import {
  section,
  div,
  h2,
  p,
  a,
  component$,
  match_,
  when_,
  default_
} from 'nanoviews'
import {
  $residents,
  $residentsError,
  $residentsLoading
} from '#src/stores/characters'
import { LocationDetail } from '#src/ui/blocks/LocationDetail'
import { CharactersGrid } from '#src/ui/blocks/CharactersGrid'
import { Spinner } from '#src/ui/components/Spinner'

const Location = component$(() => match_(
  when_($residentsError, $error => div({
    class: 'location-error'
  })(
    h2()(
      'Error loading location'
    ),
    p()(
      $error
    )
  )),
  when_(or($residentsLoading, not($residents)), () => Spinner()(
    'Loading location...'
  )),
  default_(() => section({
    class: 'location-container'
  })(
    LocationDetail(),
    div({
      class: 'location-residents-section'
    })(
      h2({
        id: 'residents',
        class: 'location-residents-title'
      })(
        a({
          href: '#residents'
        })(
          'Residents (', () => $residents()?.length, ')'
        )
      ),
      CharactersGrid({
        $characters: $residents
      })
    )
  ))
))

export default Location
