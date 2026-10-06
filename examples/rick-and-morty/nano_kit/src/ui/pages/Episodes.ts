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
  fragment,
  component$,
  match_,
  when_,
  default_
} from 'nanoviews'
import { $episodesPage } from '#src/stores/router'
import {
  $episodes,
  $episodesError,
  $episodesLoading
} from '#src/stores/episodes'
import { EpisodesGrid } from '#src/ui/blocks/EpisodesGrid'
import { Pagination } from '#src/ui/components/Pagination'
import { Spinner } from '#src/ui/components/Spinner'

function formatUrl(page: number) {
  return `?page=${page}`
}

function formatPageLabel(page: number) {
  return `Go to page ${page}`
}

const Episodes = component$(() => section({
  class: 'episodes-container'
})(
  match_(
    when_($episodesError, $error => div({
      class: 'episodes-error'
    })(
      h2()(
        'Error loading episodes'
      ),
      p()(
        $error
      )
    )),
    when_(or($episodesLoading, not($episodes)), () => Spinner()(
      'Loading episodes...'
    )),
    default_(() => fragment(
      EpisodesGrid({
        $episodes: () => $episodes()?.items
      }),
      Pagination({
        $current: $episodesPage,
        $total: () => $episodes()?.totalPages ?? 0,
        formatUrl,
        previousLabel: 'Previous',
        nextLabel: 'Next',
        formatPageLabel,
        label: 'Episode pages navigation'
      })
    ))
  )
))

export default Episodes
