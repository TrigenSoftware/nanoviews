import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { div } from './elements.js'
import {
  classList$,
  classIf$,
  classGet$
} from './classList.js'

const meta: Meta<{
  className?: string
  classList?: string[]
  enabled?: boolean
  theme?: string
}> = {
  title: 'Elements/Effect Attributes/Class List'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticString: Story = {
  render: nanoStory(() => div({
    [classList$]: 'static-class'
  })('Hello, world!'))
}

export const ReactiveString: Story = {
  args: {
    className: 'static-class'
  },
  render: nanoStory(({ className }) => div({
    [classList$]: className
  })('Hello, world!'))
}

export const StaticStrings: Story = {
  render: nanoStory(() => div({
    [classList$]: ['class-a', 'class-b']
  })('Hello, world!'))
}

export const ReactiveStringsArray: Story = {
  args: {
    classList: ['class-a', 'class-b']
  },
  render: nanoStory(({ classList }) => div({
    [classList$]: classList
  })('Hello, world!'))
}

export const ReactiveStrings: Story = {
  args: {
    className: 'class-a'
  },
  render: nanoStory(({ className }) => div({
    [classList$]: [className]
  })('Hello, world!'))
}

export const NestedStrings: Story = {
  args: {
    className: 'class-a'
  },
  render: nanoStory(({ className }) => div({
    [classList$]: [
      [className],
      ['class-b'],
      'class-c'
    ]
  })('Hello, world!'))
}

export const EmptyValues: Story = {
  args: {
    className: 'class-a'
  },
  render: nanoStory(({ className }) => div({
    [classList$]: [
      [className],
      null,
      undefined
    ]
  })('Hello, world!'))
}

export const ClassIf: Story = {
  args: {
    className: 'class-a',
    enabled: true
  },
  render: nanoStory(({ className, enabled }) => div({
    [classList$]: classIf$(className, enabled)
  })('Hello, world!'))
}

export const ClassGet: Story = {
  argTypes: {
    theme: {
      control: 'radio',
      options: ['primary', 'secondary']
    }
  },
  args: {
    theme: 'primary'
  },
  render: nanoStory(({ theme }) => div({
    [classList$]: classGet$({
      primary: 'theme-primary',
      secondary: 'theme-secondary'
    }, theme)
  })('Hello, world!'))
}
