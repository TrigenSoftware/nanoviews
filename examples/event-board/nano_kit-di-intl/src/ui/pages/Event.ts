import {
  inject,
  record,
  and,
  not,
  when
} from 'nanoviews/store'
import {
  section,
  div,
  p,
  h1,
  dl,
  dt,
  dd,
  button,
  component$,
  if_,
  match_,
  when_,
  default_
} from 'nanoviews'
import {
  Link,
  meta,
  title
} from '@nanoviews/router'
import {
  datetime,
  format,
  number,
  params,
  text,
  capitalize
} from '@nano_kit/intl'
import {
  EventDetails$,
  RsvpEvent$
} from '#src/stores/events'
import { Intl$ } from '#src/stores/intl'
import { Params$ } from '#src/stores/router'

function Messages$() {
  const { messages } = inject(Intl$)

  return messages('event', {
    eventPageTitle: params({
      title: text()
    }),
    notFoundDescription: params({
      slug: text()
    }),
    attendees: format(number()),
    eventDate: format(capitalize(datetime({
      dateStyle: 'full',
      timeStyle: 'short'
    })))
  })
}

export function Head$() {
  const { $event } = inject(EventDetails$)
  const [$t] = inject(Messages$)

  return [
    title(() => {
      const t = $t()
      const event = $event()

      return event
        ? t.eventPageTitle({
          title: event.title
        })
        : t.pageTitle
    }),
    meta({
      name: 'description',
      content: () => $event()?.description ?? $t.$pageDescription()
    })
  ]
}

const EventPage = component$(() => {
  const { $slug } = inject(Params$)
  const {
    $event: event,
    $eventError,
    $eventLoading
  } = inject(EventDetails$)
  const {
    rsvp,
    $rsvpError,
    $rsvpLoading
  } = inject(RsvpEvent$)
  const [$t] = inject(Messages$)
  const $event = record(event)
  const onRsvp = () => {
    void rsvp($event()!.id)
  }

  return match_(
    when_($eventError, $error => section({
      class: 'page'
    })(
      div({
        class: 'notice notice_error'
      })(
        $error
      )
    )),
    when_(and($eventLoading, not($event)), () => section({
      class: 'page'
    })(
      div({
        class: 'notice'
      })(
        $t.$loading
      )
    )),
    when_(not($event), () => section({
      class: 'page'
    })(
      div({
        class: 'page__header'
      })(
        p({
          class: 'eyebrow'
        })(
          $t.$notFoundEyebrow
        ),
        h1()(
          $t.$notFoundTitle
        ),
        p()(
          () => $t().notFoundDescription({
            slug: $slug()
          })
        )
      ),
      Link({
        class: 'button button_secondary',
        to: 'home'
      })(
        $t.$backToEvents
      )
    )),
    default_(() => section({
      class: 'page'
    })(
      div({
        class: 'page__header'
      })(
        p({
          class: 'eyebrow'
        })(
          () => $t().categories?.[$event()!.category]
        ),
        h1()(
          $event.$title
        ),
        p()(
          $event.$description
        )
      ),
      div({
        class: 'details-panel'
      })(
        dl()(
          div()(
            dt()(
              $t.$when
            ),
            dd()(
              () => $t().eventDate($event()!.startsAt)
            )
          ),
          div()(
            dt()(
              $t.$where
            ),
            dd()(
              $event.$location
            )
          ),
          if_($event.$author)(
            $author => div()(
              dt()(
                $t.$hostedBy
              ),
              dd()(
                $author
              )
            )
          ),
          div()(
            dt()(
              $t.$going
            ),
            dd()(
              () => $t().attendees($event()!.attendees)
            )
          )
        ),
        if_($rsvpError)(
          $error => div({
            class: 'notice notice_error'
          })(
            $error
          )
        ),
        button({
          class: 'button',
          type: 'button',
          disabled: $rsvpLoading,
          onClick: onRsvp
        })(
          when($rsvpLoading, $t.$saving, when($event.$going, $t.$rsvpCancel, $t.$rsvp))
        )
      ),
      Link({
        class: 'button button_secondary',
        to: 'home'
      })(
        $t.$backToEvents
      )
    ))
  )
})

export default EventPage
