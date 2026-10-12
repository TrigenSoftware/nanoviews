import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { Button } from '../Button'
import { LetterCard } from './LetterCard'
import { LetterCardContent } from './LetterCardContent'
import { LetterCardFooter } from './LetterCardFooter'

const LETTER = `Dear Apple team,

I am writing to apply for the Product manager position. Over the past five years I have shipped consumer products from the first sketch to millions of users, side by side with design, engineering and marketing.

I am good at HTML, CSS and doing things in time, and I would love to bring that to your team.

Thank you for your time and consideration.`
const meta: Meta<{
  value: string
  placeholder: string
  maxLines: number
}> = {
  title: 'UIKit/LetterCard',
  argTypes: {
    value: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    maxLines: {
      control: 'number'
    }
  },
  args: {
    value: LETTER,
    placeholder: 'Your personalized job application will appear here...',
    maxLines: 0
  },
  render(props) {
    return (
      LetterCard()(
        LetterCardContent(props),
        LetterCardFooter()(
          Button({
            icon: 'trash',
            size: 'sm',
            variant: 'subtle',
            color: 'danger'
          })(
            'Delete'
          ),
          Button({
            icon: 'copy',
            iconAlign: 'right',
            size: 'sm',
            variant: 'subtle'
          })(
            'Copy to clipboard'
          )
        )
      )
    )
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Clamped: Story = {
  args: {
    maxLines: 6
  }
}

export const Empty: Story = {
  args: {
    value: ''
  }
}
