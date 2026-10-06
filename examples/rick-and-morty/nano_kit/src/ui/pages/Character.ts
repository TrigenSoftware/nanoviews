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
  $characterEpisodes,
  $characterEpisodesError,
  $characterEpisodesLoading
} from '#src/stores/episodes'
import { CharacterDetail } from '#src/ui/blocks/CharacterDetail'
import { EpisodesGrid } from '#src/ui/blocks/EpisodesGrid'
import { Spinner } from '#src/ui/components/Spinner'

const Character = component$(() => match_(
  when_($characterEpisodesError, $error => div({
    class: 'character-error'
  })(
    h2()(
      'Error loading character'
    ),
    p()(
      $error
    )
  )),
  when_(or($characterEpisodesLoading, not($characterEpisodes)), () => Spinner()(
    'Loading character...'
  )),
  default_(() => section({
    class: 'character-container'
  })(
    CharacterDetail(),
    div({
      class: 'character-episodes-section'
    })(
      h2({
        id: 'episodes',
        class: 'character-episodes-title'
      })(
        a({
          href: '#episodes'
        })(
          'Episodes (', () => $characterEpisodes()?.length, ')'
        )
      ),
      EpisodesGrid({
        $episodes: $characterEpisodes
      })
    )
  ))
))

export default Character
