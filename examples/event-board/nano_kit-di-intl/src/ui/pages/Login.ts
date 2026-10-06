import {
  inject,
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
  button,
  component$,
  if_
} from 'nanoviews'
import { title } from '@nanoviews/router'
import {
  match,
  other
} from '@nano_kit/intl'
import { UserError } from '#src/services/user'
import { User$ } from '#src/stores/user'
import { Intl$ } from '#src/stores/intl'

function Messages$() {
  const { messages } = inject(Intl$)

  return messages('login', {
    errors: match('type', other(UserError.LoginFailed))
  })
}

export function Head$() {
  const [$t] = inject(Messages$)

  return [
    title($t.$pageTitle)
  ]
}

const LoginPage = component$(() => {
  const {
    login,
    $loginError,
    $loginLoading
  } = inject(User$)
  const [$t] = inject(Messages$)
  const onSubmit = (event: Event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const username = formData.get('username')
    const password = formData.get('password')

    void login({
      username: typeof username === 'string' ? username : '',
      password: typeof password === 'string' ? password : ''
    })
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
      ),
      p({
        class: 'shortcut-hint'
      })(
        $t.$demoHint
      )
    ),
    form({
      class: 'form',
      onSubmit
    })(
      label({
        class: 'field',
        for: 'login-username'
      })(
        span()(
          $t.$usernameLabel
        ),
        input({
          id: 'login-username',
          name: 'username',
          type: 'text',
          autoComplete: 'username',
          required: true
        })
      ),
      label({
        class: 'field',
        for: 'login-password'
      })(
        span()(
          $t.$passwordLabel
        ),
        input({
          id: 'login-password',
          name: 'password',
          type: 'password',
          autoComplete: 'current-password',
          required: true
        })
      ),
      if_($loginError)(
        $error => div({
          class: 'notice notice_error'
        })(
          () => $t().errors($error())
        )
      ),
      button({
        class: 'button',
        type: 'submit',
        disabled: $loginLoading
      })(
        when($loginLoading, $t.$submitting, $t.$submit)
      )
    )
  )
})

export default LoginPage
