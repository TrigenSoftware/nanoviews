import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { div } from './elements.js'
import { aria$ } from './aria.js'

const meta: Meta<{
  description: string
}> = {
  title: 'Elements/Effect Attributes/ARIA'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render: nanoStory(() => div({
    [aria$]: {
      description: 'Test div description'
    }
  })('Hello, world!'))
}

export const ReactiveValue: Story = {
  args: {
    description: 'Test div description'
  },
  render: nanoStory(({ description }) => div({
    [aria$]: {
      description
    }
  })('Hello, world!'))
}
