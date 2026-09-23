import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import {
  provide,
  inject
} from 'kida'
import { createElement } from '../elements/index.js'
import { component$ } from './component.js'
import {
  context$,
  isolate$
} from './context.js'

const meta: Meta = {
  title: 'Component/Context'
}

export default meta

type Story = StoryObj<typeof meta>

const Theme$ = () => 'light'
const User$ = () => 'Guest'
const Theme = component$(() => {
  const theme = inject(Theme$)

  return (
    createElement('div')(
      'Theme: ', theme
    )
  )
})
const ThemeAndUser = component$(() => {
  const theme = inject(Theme$)
  const user = inject(User$)

  return (
    createElement('div')(
      'Theme: ', theme, ' User: ', user
    )
  )
})

export const DefaultValue: Story = {
  render() {
    return context$()(
      Theme()
    )
  }
}

export const OneContext: Story = {
  render() {
    return context$(
      provide(Theme$, 'dark')
    )(
      Theme()
    )
  }
}

export const FewContexts: Story = {
  render() {
    return (
      context$(
        provide(Theme$, 'dark'),
        provide(User$, 'Admin')
      )(
        ThemeAndUser()
      )
    )
  }
}

export const NestedContext: Story = {
  render() {
    return (
      context$(
        provide(Theme$, 'dark')
      )(
        createElement('div')(
          Theme(),
          context$(
            provide(Theme$, 'blue')
          )(
            Theme()
          )
        )
      )
    )
  }
}

export const IsolatedContext: Story = {
  render() {
    return (
      context$(
        provide(Theme$, 'dark')
      )(
        createElement('div')(
          Theme(),
          isolate$(
            context$(
              provide(User$, 'Admin')
            )(
              ThemeAndUser()
            )
          )
        )
      )
    )
  }
}
