/* DISCLAIMER! VIBECODED! */
import {
  type Accessor,
  computed,
  gt,
  is,
  lt,
  and,
  when
} from 'nanoviews/store'
import {
  nav,
  ul,
  li,
  span,
  component$,
  for_,
  if_
} from 'nanoviews'
import { Link } from '#src/ui/components/Link'

export interface PaginationProps {
  $current: Accessor<number>
  $total: Accessor<number>
  formatUrl: (page: number) => string
  showSiblings?: number
  previousLabel: string
  nextLabel: string
  formatPageLabel: (page: number) => string
  label: string
}

export const Pagination = component$(({
  $current,
  $total,
  formatUrl,
  showSiblings = 2,
  previousLabel,
  nextLabel,
  formatPageLabel,
  label
}: PaginationProps) => {
  const $pages = computed(() => {
    const current = $current()
    const total = $total()
    const delta = showSiblings
    const range = []
    const rangeWithDots: (number | string)[] = []
    const start = Math.max(2, current - delta)
    const end = Math.min(total - 1, current + delta)

    for (let i = start; i <= end; i++) {
      range.push(i)
    }

    // Add first page
    if (start > 2) {
      rangeWithDots.push(1, '...')
    } else if (start === 2) {
      rangeWithDots.push(1)
    } else {
      rangeWithDots.push(1)
    }

    // Add calculated range
    rangeWithDots.push(...range)

    // Add last page
    if (end < total - 1) {
      rangeWithDots.push('...', total)
    } else if (end === total - 1) {
      rangeWithDots.push(total)
    } else if (total > 1) {
      // Only add last page if it's different from first
      if (total !== 1) {
        rangeWithDots.push(total)
      }
    }

    // Remove duplicates and filter out invalid entries
    return rangeWithDots.filter((item, index, arr) => {
      if (typeof item === 'number') {
        return item <= total && arr.indexOf(item) === index
      }

      return true
    })
  })

  return if_(gt($total, 1))(
    () => nav({
      'role': 'navigation',
      'aria-label': label,
      'class': 'pagination-pagination'
    })(
      ul({
        class: 'pagination-list'
      })(
        // Previous button
        if_(gt($current, 1))(
          () => li()(
            Link({
              'href': () => formatUrl($current() - 1),
              'aria-label': previousLabel,
              'class': 'pagination-link pagination-prev-next'
            })(
              span({
                'aria-hidden': 'true'
              })(
                '‹'
              ),
              span({
                class: 'pagination-sr-only'
              })(
                previousLabel
              )
            )
          )
        ),
        // Page numbers
        for_($pages, (pageNumber, index) => `${pageNumber}-${index}`)(
          ($pageNumber) => {
            // A row is keyed by its value, so the value never changes in it
            const pageNumber = $pageNumber()

            return li()(
              typeof pageNumber === 'number'
                ? Link({
                  'href': formatUrl(pageNumber),
                  'aria-current': and(is($current, pageNumber), 'page'),
                  'aria-label': formatPageLabel(pageNumber),
                  'class': [
                    'pagination-link',
                    when(is($current, pageNumber), 'pagination-current', 'pagination-page')
                  ]
                })(
                  pageNumber
                )
                : span({
                  'class': 'pagination-ellipsis',
                  'aria-hidden': 'true'
                })(
                  pageNumber
                )
            )
          }
        ),
        // Next button
        if_(lt($current, $total))(
          () => li()(
            Link({
              'href': () => formatUrl($current() + 1),
              'aria-label': nextLabel,
              'class': 'pagination-link pagination-prev-next'
            })(
              span({
                'aria-hidden': 'true'
              })(
                '›'
              ),
              span({
                class: 'pagination-sr-only'
              })(
                nextLabel
              )
            )
          )
        )
      )
    )
  )
})
