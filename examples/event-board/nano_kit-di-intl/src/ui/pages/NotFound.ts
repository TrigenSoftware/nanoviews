import { inject } from 'nanoviews/store'
import {
  section,
  div,
  p,
  h1,
  component$
} from 'nanoviews'
import {
  Link,
  title
} from '@nanoviews/router'
import { Intl$ } from '#src/stores/intl'

function Messages$() {
  const { messages } = inject(Intl$)

  return messages('notFound')
}

export function Head$() {
  const [$t] = inject(Messages$)

  return [
    title($t.$pageTitle)
  ]
}

const NotFoundPage = component$(() => {
  const [$t] = inject(Messages$)

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
    Link({
      class: 'button button_secondary',
      to: 'home'
    })(
      $t.$backToEvents
    )
  )
})

export default NotFoundPage
