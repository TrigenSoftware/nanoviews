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
import { EpisodeDetail } from '#src/ui/blocks/EpisodeDetail'
import { CharactersGrid } from '#src/ui/blocks/CharactersGrid'
import { Spinner } from '#src/ui/components/Spinner'

const Episode = component$(() => match_(
  when_($residentsError, $error => div({
    class: 'episode-error'
  })(
    h2()(
      'Error loading episode'
    ),
    p()(
      $error
    )
  )),
  when_(or($residentsLoading, not($residents)), () => Spinner()(
    'Loading episode...'
  )),
  default_(() => section({
    class: 'episode-container'
  })(
    EpisodeDetail(),
    div({
      class: 'episode-characters-section'
    })(
      h2({
        id: 'characters',
        class: 'episode-characters-title'
      })(
        a({
          href: '#characters'
        })(
          'Characters (', () => $residents()?.length, ')'
        )
      ),
      CharactersGrid({
        $characters: $residents
      })
    )
  ))
))

export default Episode
