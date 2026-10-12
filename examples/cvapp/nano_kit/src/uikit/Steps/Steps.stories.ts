import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { Steps } from './Steps'

const meta: Meta<{
  value: number
  size: 'md' | 'lg'
}> = {
  title: 'UIKit/Steps',
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 5
      }
    },
    size: {
      control: 'select',
      options: ['md', 'lg']
    }
  },
  args: {
    value: 2,
    size: 'md'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render(props) {
    return (
      Steps({
        ...props,
        // The steps are built once for it
        max: 5
      })
    )
  }
}

export const Large: Story = {
  args: {
    size: 'lg'
  },
  render(props) {
    return (
      Steps({
        ...props,
        max: 5
      })
    )
  }
}
