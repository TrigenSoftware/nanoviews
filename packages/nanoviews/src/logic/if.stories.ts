import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { b } from '../elements/elements.js'
import { if$ } from './if.js'

const meta: Meta<{
  value: boolean
}> = {
  title: 'Logic/if$'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render: nanoStory(() => if$(true)(
    () => b()('True'),
    () => 'False'
  ))
}

export const ReactiveValue: Story = {
  args: {
    value: true
  },
  render: nanoStory(({ value }) => if$(value)(
    $val => b()('True: ', $val),
    () => 'False'
  ))
}

export const ReactiveValueThenOnly: Story = {
  args: {
    value: true
  },
  render: nanoStory(({ value }) => if$(value)(
    $val => b()('True: ', $val)
  ))
}
