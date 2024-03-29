import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { createElement } from '../elements/index.js'
import {
  createContext,
  provideContext
} from './context.js'

const meta: Meta = {
  title: 'Internals/Logic/Context'
}

export default meta

type Story = StoryObj<typeof meta>

const [ThemeContext, getTheme] = createContext('light')
const [UserContext, getUser] = createContext('Guest')

export const DefaultValue: Story = {
  render: nanoStory(
    () => createElement('div')('Default theme: ', getTheme())
  )
}

export const OneContext: Story = {
  render: nanoStory(
    () => provideContext(ThemeContext('dark'), () => createElement('div')('Theme: ', getTheme()))
  )
}

export const FewContexts: Story = {
  render: nanoStory(
    () => provideContext(
      [ThemeContext('dark'), UserContext('Admin')],
      () => createElement('div')(
        'Theme: ',
        getTheme(),
        ' User: ',
        getUser()
      )
    )
  )
}
