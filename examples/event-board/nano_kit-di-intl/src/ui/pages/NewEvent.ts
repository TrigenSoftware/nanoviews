import {
  inject,
  not,
  or,
  pick,
  when
} from 'nanoviews/store'
import {
  section,
  div,
  p,
  h1,
  form,
  label,
  span,
  input,
  textarea,
  select,
  option,
  small,
  button,
  component$,
  effect$,
  if_
} from 'nanoviews'
import { title } from '@nanoviews/router'
import { eventCategories } from '#src/services/events'
import { NewEventForm$ } from '#src/stores/events'
import { Intl$ } from '#src/stores/intl'

function Messages$() {
  const { messages } = inject(Intl$)

  return messages('newEvent')
}

export function Head$() {
  const [$t] = inject(Messages$)

  return [
    title($t.$pageTitle)
  ]
}

const NewEventPage = component$(() => {
  const {
    $title,
    $description,
    $startsAt,
    $location,
    $category,
    $errors,
    $valid,
    $createError,
    $createLoading,
    fillMock,
    submit
  } = inject(NewEventForm$)
  const [$t] = inject(Messages$)
  const onSubmit = (event: Event) => {
    event.preventDefault()
    void submit()
  }

  effect$(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === 'm'
        && (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault()
        fillMock()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  })

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
      ),
      p({
        class: 'shortcut-hint'
      })(
        $t.$shortcut
      )
    ),
    form({
      class: 'form',
      onSubmit
    })(
      label({
        class: 'field',
        for: 'event-title'
      })(
        span()(
          $t.$titleLabel
        ),
        input({
          id: 'event-title',
          name: 'title',
          value: $title,
          type: 'text',
          placeholder: $t.$titlePlaceholder,
          required: true
        }),
        if_(pick($errors, 'title'))(
          () => small()(
            () => $t().errors?.title
          )
        )
      ),
      label({
        class: 'field',
        for: 'event-description'
      })(
        span()(
          $t.$descriptionLabel
        ),
        textarea({
          id: 'event-description',
          name: 'description',
          value: $description,
          placeholder: $t.$descriptionPlaceholder,
          required: true
        }),
        if_(pick($errors, 'description'))(
          () => small()(
            () => $t().errors?.description
          )
        )
      ),
      div({
        class: 'form__row'
      })(
        label({
          class: 'field',
          for: 'event-starts-at'
        })(
          span()(
            $t.$startsAtLabel
          ),
          input({
            id: 'event-starts-at',
            name: 'startsAt',
            value: $startsAt,
            type: 'datetime-local',
            required: true
          }),
          if_(pick($errors, 'startsAt'))(
            () => small()(
              () => $t().errors?.startsAt
            )
          )
        ),
        label({
          class: 'field',
          for: 'event-category'
        })(
          span()(
            $t.$categoryLabel
          ),
          select({
            id: 'event-category',
            name: 'category',
            value: $category,
            required: true
          })(
            ...eventCategories.map(category => option({
              value: category
            })(
              () => $t().categories?.[category]
            ))
          )
        )
      ),
      label({
        class: 'field',
        for: 'event-location'
      })(
        span()(
          $t.$locationLabel
        ),
        input({
          id: 'event-location',
          name: 'location',
          value: $location,
          type: 'text',
          placeholder: $t.$locationPlaceholder,
          required: true
        }),
        if_(pick($errors, 'location'))(
          () => small()(
            () => $t().errors?.location
          )
        )
      ),
      if_($createError)(
        $error => div({
          class: 'notice notice_error'
        })(
          $error
        )
      ),
      button({
        class: 'button',
        type: 'submit',
        disabled: or(not($valid), $createLoading)
      })(
        when($createLoading, $t.$creating, $t.$create)
      )
    )
  )
})

export default NewEventPage
