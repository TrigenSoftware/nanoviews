import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { Paper } from './Paper'

const meta: Meta<{
  color: 'success' | null
}> = {
  title: 'UIKit/Paper',
  argTypes: {
    color: {
      control: 'select',
      options: ['success']
    }
  },
  args: {
    color: null
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render(props) {
    return Paper(props)('Generate and send out couple more job applications today to get hired faster')
  }
}

export const Success: Story = {
  args: {
    color: 'success'
  },
  render(props) {
    return Paper(props)('Hit your goal: five applications generated today')
  }
}
