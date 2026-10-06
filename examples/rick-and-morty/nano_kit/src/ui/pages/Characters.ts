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
import { $charactersPage } from '#src/stores/router'
import {
  $characters,
  $charactersError,
  $charactersLoading
} from '#src/stores/characters'
import { CharactersGrid } from '#src/ui/blocks/CharactersGrid'
import { Pagination } from '#src/ui/components/Pagination'
import { Spinner } from '#src/ui/components/Spinner'

function formatUrl(page: number) {
  return `?page=${page}`
}

function formatPageLabel(page: number) {
  return `Go to page ${page}`
}

const Characters = component$(() => section({
  class: 'characters-container'
})(
  match_(
    when_($charactersError, $error => div({
      class: 'characters-error'
    })(
      h2()(
        'Error loading characters'
      ),
      p()(
        $error
      )
    )),
    when_(or($charactersLoading, not($characters)), () => Spinner()(
      'Loading characters...'
    )),
    default_(() => fragment(
      CharactersGrid({
        $characters: () => $characters()?.items
      }),
      Pagination({
        $current: $charactersPage,
        $total: () => $characters()?.totalPages ?? 0,
        formatUrl,
        previousLabel: 'Previous',
        nextLabel: 'Next',
        formatPageLabel,
        label: 'Character pages navigation'
      })
    ))
  )
))

export default Characters
