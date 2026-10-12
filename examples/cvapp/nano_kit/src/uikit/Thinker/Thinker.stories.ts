import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { Paper } from '../Paper'
import { Thinker } from './Thinker'

const meta: Meta<{
  label: string
}> = {
  title: 'UIKit/Thinker',
  argTypes: {
    label: {
      control: 'text'
    }
  },
  args: {
    label: 'Loading...'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render(props) {
    // On a paper, as on the letter card it waits on: its glow shows against the gray
    return (
      Paper()(
        Thinker(props)
      )
    )
  }
}
