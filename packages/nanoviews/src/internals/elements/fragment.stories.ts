import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { createElement } from './element.js'
import { createFragment } from './fragment.js'

const meta: Meta<{
  text: string
  number: number
  boolean: boolean
}> = {
  title: 'Internals/Elements/Fragment'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticPrimitives: Story = {
  render: nanoStory(() => createFragment('string', '|', 123, '|', true, '|', false, '|', null, '|', undefined))
}

export const ReactivePrimitives: Story = {
  args: {
    text: 'Hello, world!',
    number: 123,
    boolean: true
  },
  render: nanoStory(({ text, number, boolean }) => createFragment(text, '|', number, '|', boolean))
}

export const ChildrenBlocks: Story = {
  args: {
    text: 'Hello, world!',
    number: 123,
    boolean: true
  },
  render: nanoStory(({ text, number, boolean }) => createFragment(
    text,
    createElement('br'),
    number,
    createElement('br'),
    boolean
  ))
}
