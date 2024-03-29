import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { b } from '../elements/elements.js'
import { decide$ } from './decide.js'

const meta: Meta<{
  value: boolean
}> = {
  title: 'Logic/decide$'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render: nanoStory(() => decide$(
    true,
    value => (value ? b()('True') : 'False')
  ))
}

export const ReactiveValue: Story = {
  args: {
    value: true
  },
  render: nanoStory(({ value }) => decide$(
    value,
    value => (value ? b()('True') : 'False')
  ))
}
