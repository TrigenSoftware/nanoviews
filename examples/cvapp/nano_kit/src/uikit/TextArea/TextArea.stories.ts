import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { TextArea } from './TextArea'

const DETAILS = 'Five years of product management in consumer apps: from the first sketch to millions of users, side by side with design, engineering and marketing.'
const meta: Meta<{
  value: string
  placeholder: string
  maxLength: number
  rows: number
  disabled: boolean
}> = {
  title: 'UIKit/TextArea',
  component: TextArea,
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
    maxLength: {
      control: 'number'
    },
    rows: {
      control: 'number'
    },
    disabled: {
      control: 'boolean'
    }
  },
  args: {
    value: '',
    placeholder: 'Describe why you are a great fit or paste your bio',
    maxLength: 1200,
    rows: 6,
    disabled: false
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Filled: Story = {
  args: {
    value: DETAILS
  }
}

export const TooLong: Story = {
  args: {
    value: DETAILS,
    maxLength: 100
  }
}

export const Disabled: Story = {
  args: {
    value: DETAILS,
    disabled: true
  }
}
