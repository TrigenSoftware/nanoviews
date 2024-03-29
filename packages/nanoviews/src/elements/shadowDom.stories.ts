import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { div } from './elements.js'
import { attachShadow } from './shadowDom.js'

const meta: Meta = {
  title: 'Elements/Shadow DOM'
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: nanoStory(() => attachShadow(
    div({
      'data-testid': 'shadow-root'
    }),
    {
      mode: 'open'
    }
  )(
    'Nanoviews can shadow DOM!'
  ))
}
