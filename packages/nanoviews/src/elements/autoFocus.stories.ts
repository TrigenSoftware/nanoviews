import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { atom } from '@nanoviews/stores'
import { textarea } from './elements.js'
import { autoFocus$ } from './autoFocus.js'

const meta: Meta = {
  title: 'Elements/Effect Attributes/Auto Focus'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render: nanoStory(() => textarea({
    [autoFocus$]: true
  })('Hello, world!'))
}

export const ReactiveValue: Story = {
  render: nanoStory(() => textarea({
    [autoFocus$]: atom(true)
  })('Hello, world!'))
}
