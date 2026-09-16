import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { div } from '../../elements/elements.js'

const meta: Meta<{
  color: string
}> = {
  title: 'Internals/Elements/Style'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render() {
    return (
      div({
        style: {
          color: 'green'
        }
      })(
        'Hello, world!'
      )
    )
  }
}

export const ReactiveValue: Story = {
  args: {
    color: 'green'
  },
  render({ color }) {
    return (
      div({
        style: {
          color
        }
      })(
        'Hello, world!'
      )
    )
  }
}

export const CustomProperty: Story = {
  args: {
    color: 'green'
  },
  render({ color }) {
    return (
      div({
        style: {
          '--accent': color,
          '--gap': '4px'
        }
      })(
        'Hello, world!'
      )
    )
  }
}

export const MultiWordValue: Story = {
  args: {
    color: 'green'
  },
  render({ color }) {
    return (
      div({
        style: {
          backgroundColor: color,
          fontSize: '12px'
        }
      })(
        'Hello, world!'
      )
    )
  }
}
