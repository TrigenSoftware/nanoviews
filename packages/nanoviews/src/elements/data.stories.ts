import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { div } from './elements.js'
import { data$ } from './data.js'

const meta: Meta<{
  payload: string
}> = {
  title: 'Elements/Effect Attributes/Data'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render: nanoStory(() => div({
    [data$]: {
      payload: 'Test div data payload'
    }
  })('Hello, world!'))
}

export const ReactiveValue: Story = {
  args: {
    payload: 'Test div data payload'
  },
  render: nanoStory(({ payload }) => div({
    [data$]: {
      payload
    }
  })('Hello, world!'))
}
