import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { TextInput } from './TextInput'

const meta: Meta<{
  value: string
  placeholder: string
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search'
  disabled: boolean
}> = {
  title: 'UIKit/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    value: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel', 'url', 'search']
    },
    disabled: {
      control: 'boolean'
    }
  },
  args: {
    value: '',
    placeholder: 'Product manager',
    type: 'text',
    disabled: false
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Filled: Story = {
  args: {
    value: 'Product manager'
  }
}

export const Invalid: Story = {
  args: {
    value: 'jane.doe',
    placeholder: 'jane@example.com',
    type: 'email'
  }
}

export const Disabled: Story = {
  args: {
    value: 'Product manager',
    disabled: true
  }
}
