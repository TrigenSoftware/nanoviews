import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { div } from 'nanoviews'
import {
  type IconName,
  Icon
} from './Icon'

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
  name: IconName
  width: number
  height: number
}> = {
  title: 'UIKit/Icon',
  component: Icon,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    name: {
      control: 'select',
      options: ICON_NAMES
    },
    width: {
      control: {
        type: 'range',
        min: 8,
        max: 48
      }
    },
    height: {
      control: {
        type: 'range',
        min: 8,
        max: 48
      }
    }
  },
  args: {
    name: 'flower',
    width: 24,
    height: 24
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Gallery: Story = {
  render({
    width,
    height
  }) {
    return (
      div({
        style: {
          display: 'flex',
          gap: '16px'
        }
      })(
        ...ICON_NAMES.map(name => Icon({
          name,
          width,
          height
        }))
      )
    )
  }
}
