import type { Meta, StoryObj } from '@nanoviews/storybook'
import type { WritableAtom } from 'nanostores'
import { nanoStory } from '@nanoviews/storybook'
import { ul, li } from '../elements/elements.js'
import { for$ } from './for.js'

const meta: Meta<{
  items: (string | WritableAtom<string>)[]
}> = {
  title: 'Logic/for$'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render: nanoStory(() => ul()(
    for$(
      [
        'Yatoro',
        'Larl',
        'Collapse',
        'Mira',
        'Miposhka'
      ],
      item => li()(item)
    )
  ))
}

export const ReactiveValue: Story = {
  args: {
    items: [
      'Yatoro',
      'Larl',
      'Collapse',
      'Mira',
      'Miposhka'
    ]
  },
  render: nanoStory(({ items }) => ul()(
    for$(
      items,
      v => v,
      item => li()(item)
    )
  ))
}

