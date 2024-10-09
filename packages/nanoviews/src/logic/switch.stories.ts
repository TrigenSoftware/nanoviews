import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { b } from '../elements/elements.js'
import {
  switch$,
  case$,
  default$
} from './switch.js'

const meta: Meta<{
  state: 'loading' | 'success' | 'error'
}> = {
  title: 'Logic/switch$'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render: nanoStory(() => switch$('loading')(
    case$('loading', () => b()('Loading')),
    case$('error', () => b()('Error')),
    default$(() => 'Success')
  ))
}

export const ReactiveValue: Story = {
  args: {
    state: 'loading'
  },
  render: nanoStory(({ state }) => switch$(state)(
    case$('loading', () => b()('Loading')),
    case$('error', () => b()('Error')),
    default$(() => 'Success')
  ))
}
