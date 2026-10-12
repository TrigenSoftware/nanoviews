import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { ErrorMessage } from './ErrorMessage'

const meta: Meta<{
  message: string
}> = {
  title: 'UIKit/ErrorMessage',
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    message: {
      control: 'text'
    }
  },
  args: {
    message: 'Failed to generate the letter, please try again'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render({ message }) {
    return ErrorMessage()(message)
  }
}
