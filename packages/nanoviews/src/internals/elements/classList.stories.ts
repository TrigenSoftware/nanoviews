import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { when } from 'kida'
import {
  button,
  div
} from '../../elements/elements.js'

const meta: Meta = {
  title: 'Internals/Elements/Class List'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render() {
    return (
      div({
        class: [
          'class1',
          false,
          'class3'
        ]
      })(
        'Hello, world!'
      )
    )
  }
}

export const ReactiveValue: StoryObj<{
  primary: boolean
  rounded: boolean
}> = {
  argTypes: {
    primary: {
      control: 'boolean'
    },
    rounded: {
      control: 'boolean'
    }
  },
  args: {
    primary: true,
    rounded: false
  },
  render({ primary, rounded }) {
    return (
      button({
        class: [
          'button',
          when(primary, 'primary', 'regular'),
          when(rounded, 'rounded')
        ]
      })(
        'Hello, world!'
      )
    )
  }
}
