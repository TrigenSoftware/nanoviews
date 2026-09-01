import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { createElement } from '../elements/index.js'
import {
  provide,
  context,
  inject
} from './context.js'

const meta: Meta = {
  title: 'Component/Context'
}

export default meta

type Story = StoryObj<typeof meta>

const ThemeContext = () => 'light'
const UserContext = () => 'Guest'

export const DefaultValue: Story = {
  render() {
    return (
      context(() => createElement('div')('Default theme: ', inject(ThemeContext)))
    )
  }

}

export const OneContext: Story = {
  render() {
    return (
      context(
        [provide(ThemeContext, 'dark')],
        () => createElement('div')('Theme: ', inject(ThemeContext))
      )
    )
  }

}

export const FewContexts: Story = {
  render() {
    return (
      context(
        [provide(ThemeContext, 'dark'), provide(UserContext, 'Admin')],
        () => createElement('div')(
          'Theme: ',
          inject(ThemeContext),
          ' User: ',
          inject(UserContext)
        )
      )
    )
  }

}
