import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { createText } from './text.js'

const meta: Meta<{ value: string }> = {
  title: 'Internals/Elements/Text'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render: nanoStory(() => createText('Hello, world!'))
}

export const ReactiveValue: Story = {
  args: {
    value: 'Hello, world!'
  },
  render: nanoStory(({ value }) => createText(value))
}
