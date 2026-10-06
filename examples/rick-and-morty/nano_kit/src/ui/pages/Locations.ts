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
import { $locationsPage } from '#src/stores/router'
import {
  $locations,
  $locationsError,
  $locationsLoading
} from '#src/stores/locations'
import { LocationsGrid } from '#src/ui/blocks/LocationsGrid'
import { Pagination } from '#src/ui/components/Pagination'
import { Spinner } from '#src/ui/components/Spinner'

function formatUrl(page: number) {
  return `?page=${page}`
}

function formatPageLabel(page: number) {
  return `Go to page ${page}`
}

const Locations = component$(() => section({
  class: 'locations-container'
})(
  match_(
    when_($locationsError, $error => div({
      class: 'locations-error'
    })(
      h2()(
        'Error loading locations'
      ),
      p()(
        $error
      )
    )),
    when_(or($locationsLoading, not($locations)), () => Spinner()(
      'Loading locations...'
    )),
    default_(() => fragment(
      LocationsGrid({
        $locations: () => $locations()?.items
      }),
      Pagination({
        $current: $locationsPage,
        $total: () => $locations()?.totalPages ?? 0,
        formatUrl,
        previousLabel: 'Previous',
        nextLabel: 'Next',
        formatPageLabel,
        label: 'Location pages navigation'
      })
    ))
  )
))

export default Locations
