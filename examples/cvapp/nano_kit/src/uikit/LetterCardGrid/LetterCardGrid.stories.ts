import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { Button } from '../Button'
import {
  LetterCard,
  LetterCardContent,
  LetterCardFooter
} from '../LetterCard'
import { LetterCardGrid } from './LetterCardGrid'

const LETTERS = [
  'Dear Apple team,\n\nI am writing to apply for the Product manager position. Over the past five years I have shipped consumer products from the first sketch to millions of users.',
  'Dear Spotify team,\n\nI would love to join you as a Frontend developer. I am good at HTML, CSS and doing things in time, and I care about the small details of every screen.',
  'Dear Figma team,\n\nYour Product designer role caught my eye at once. I have spent four years designing tools for designers, and I know how much a fast canvas matters.',
  'Dear Stripe team,\n\nI am applying for the Technical writer position. I turn complex APIs into guides people enjoy reading, and I test every snippet before it ships.'
]
const meta: Meta = {
  title: 'UIKit/LetterCardGrid'
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render() {
    return (
      LetterCardGrid()(
        ...LETTERS.map(letter => LetterCard()(
          LetterCardContent({
            value: letter,
            maxLines: 6
          }),
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
        ))
      )
    )
  }
}
