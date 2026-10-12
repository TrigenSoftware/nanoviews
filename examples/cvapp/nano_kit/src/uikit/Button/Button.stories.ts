import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { a } from 'nanoviews'
import type { IconName } from '../Icon'
import { Button } from './Button'

const ICON_NAMES: IconName[] = [
  'check',
  'copy',
  'flower',
  'home',
  'plus',
  'retry',
  'trash'
]
const meta: Meta<{
  variant: 'default' | 'primary' | 'subtle'
  size: 'sm' | 'md' | 'lg'
  color: 'danger' | null
  block: boolean
  icon: IconName | null
  iconAlign: 'left' | 'right'
  disabled: boolean
}> = {
  title: 'UIKit/Button',
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'subtle']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    color: {
      control: 'select',
      options: ['danger']
    },
    block: {
      control: 'boolean'
    },
    icon: {
      control: 'select',
      options: ICON_NAMES
    },
    iconAlign: {
      control: 'select',
      options: ['left', 'right']
    },
    disabled: {
      control: 'boolean'
    }
  },
  args: {
    variant: 'default',
    size: 'md',
    color: null,
    block: false,
    icon: null,
    iconAlign: 'left',
    disabled: false
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render(props) {
    return Button(props)('Generate Now')
  }
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    icon: 'plus'
  },
  render(props) {
    return Button(props)('Create New')
  }
}

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    size: 'sm',
    icon: 'copy',
    iconAlign: 'right'
  },
  render(props) {
    return Button(props)('Copy to clipboard')
  }
}

export const Danger: Story = {
  args: {
    variant: 'subtle',
    size: 'sm',
    color: 'danger',
    icon: 'trash'
  },
  render(props) {
    return Button(props)('Delete')
  }
}

export const IconOnly: Story = {
  args: {
    size: 'sm',
    icon: 'home'
  },
  render(props) {
    return (
      Button({
        ...props,
        'aria-label': 'Go to home page'
      })
    )
  }
}

export const Link: Story = {
  args: {
    variant: 'primary',
    icon: 'plus'
  },
  render(props) {
    return (
      Button({
        ...props,
        as: a,
        href: '#'
      })(
        'Create New'
      )
    )
  }
}
