import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { h1 } from 'nanoviews'
import typography from '../typography.module.css'
import { Button } from '../Button'
import { SubHeader } from './SubHeader'

const meta: Meta<{
  title: string
}> = {
  title: 'UIKit/SubHeader',
  argTypes: {
    title: {
      control: 'text'
    }
  },
  args: {
    title: 'Applications'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render({ title }) {
    return (
      SubHeader({
        title: h1({
          class: typography.h1
        })(
          title
        )
      })(
        Button({
          variant: 'primary',
          icon: 'plus'
        })(
          'Create New'
        )
      )
    )
  }
}

export const WithoutActions: Story = {
  render({ title }) {
    return (
      SubHeader({
        title: h1({
          class: typography.h1
        })(
          title
        )
      })
    )
  }
}
