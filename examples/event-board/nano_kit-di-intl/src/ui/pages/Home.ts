import {
  computed,
  inject,
  record,
  and,
  every,
  is,
  not,
  or,
  when,
  pick
} from 'nanoviews/store'
import {
  section,
  div,
  p,
  h1,
  h2,
  form,
  label,
  span,
  input,
  select,
  option,
  article,
  button,
  trackById,
  component$,
  for_,
  if_
} from 'nanoviews'
import {
  Link,
  Navigation$,
  meta,
  title
} from '@nanoviews/router'
import {
  datetime,
  format,
  plural,
  capitalize
} from '@nano_kit/intl'
import { eventCategories } from '#src/services/events'
import { EventsList$ } from '#src/stores/events'
import { Intl$ } from '#src/stores/intl'
import { Params$ } from '#src/stores/router'

function Messages$() {
  const { messages } = inject(Intl$)

  return messages('home', {
    attendees: plural('count'),
    eventDate: format(capitalize(datetime({
      dateStyle: 'medium',
      timeStyle: 'short'
    })))
  })
}

export function Head$() {
  const [$t] = inject(Messages$)

  return [
    title($t.$pageTitle),
    meta({
      name: 'description',
      content: $t.$pageDescription
    })
  ]
}

const Home = component$(() => {
  const navigation = inject(Navigation$)
  const {
    $q,
    $category,
    $searchParams
  } = inject(Params$)
  const {
    fetchNext,
    $events,
    $eventsError,
    $eventsLoading
  } = inject(EventsList$)
  const [$t] = inject(Messages$)
  const $list = computed(() => $events()?.pages.flatMap(page => page.events) ?? [])
  const onSearch = (event: Event) => {
    const searchParams = $searchParams()

    searchParams.set('q', (event.currentTarget as HTMLInputElement).value)

    navigation.replace({
      search: searchParams.toString()
    })
  }
  const onCategory = (event: Event) => {
    const searchParams = $searchParams()

    searchParams.set('category', (event.currentTarget as HTMLSelectElement).value)

    navigation.replace({
      search: searchParams.toString()
    })
  }
  const onFilterSubmit = (event: Event) => {
    event.preventDefault()
  }
  const onLoadMore = (event: Event) => {
    (event.currentTarget as HTMLButtonElement).blur()
    void fetchNext()
  }

  return section({
    class: 'page'
  })(
    div({
      class: 'page__header'
    })(
      p({
        class: 'eyebrow'
      })(
        $t.$eyebrow
      ),
      h1()(
        $t.$title
      ),
      p()(
        $t.$description
      )
    ),
    form({
      class: 'toolbar',
      role: 'search',
      onSubmit: onFilterSubmit
    })(
      label({
        class: 'field',
        for: 'events-search'
      })(
        span()(
          $t.$search
        ),
        input({
          id: 'events-search',
          name: 'q',
          value: $q,
          onInput: onSearch,
          type: 'search',
          placeholder: $t.$searchPlaceholder
        })
      ),
      label({
        class: 'field',
        for: 'events-category'
      })(
        span()(
          $t.$category
        ),
        select({
          id: 'events-category',
          name: 'category',
          value: or($category, ''),
          onChange: onCategory
        })(
          option({
            value: ''
          })(
            $t.$allCategories
          ),
          ...eventCategories.map(category => option({
            value: category
          })(
            () => $t().categories?.[category]
          ))
        )
      )
    ),
    if_($eventsError)(
      $error => div({
        class: 'notice notice_error'
      })(
        $error
      )
    ),
    if_(every(not($eventsError), is(pick($list, 'length'), 0), not($eventsLoading)))(
      () => div({
        class: 'notice'
      })(
        $t.$noEvents
      )
    ),
    div({
      'class': ['events-grid', and($eventsLoading, 'events-grid_loading')],
      'aria-busy': $eventsLoading
    })(
      for_($list, trackById)(
        (event) => {
          const $event = record(event)

          return article({
            class: 'event-card'
          })(
            div({
              class: 'event-card__meta'
            })(
              span()(
                () => $t().categories?.[$event().category]
              ),
              span()(
                () => $t().eventDate($event().startsAt)
              )
            ),
            h2()(
              Link({
                to: 'event',
                params: {
                  // A card is a row tracked by id, so its event and slug never change in it
                  slug: $event().slug
                }
              })(
                $event.$title
              )
            ),
            p()(
              $event.$description
            ),
            div({
              class: 'event-card__footer'
            })(
              span()(
                $event.$location
              ),
              span()(
                () => $t().attendees($event().attendees)
              )
            )
          )
        }
      )
    ),
    if_(() => $events()?.more)(
      () => button({
        class: 'button button_secondary',
        type: 'button',
        disabled: $eventsLoading,
        onClick: onLoadMore
      })(
        when($eventsLoading, $t.$loading, $t.$loadMore)
      )
    ),
    if_($eventsLoading)(
      () => div({
        'class': 'notice notice_loading',
        'role': 'status',
        'aria-live': 'polite'
      })(
        $t.$loading
      )
    )
  )
})

export default Home
