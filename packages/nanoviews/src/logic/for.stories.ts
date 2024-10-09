import type { Meta, StoryObj } from '@nanoviews/storybook'
import type {
  ListStore,
  EntitiesStore,
  RecordStore
} from '@nanoviews/stores'
import {
  list,
  entities,
  record
} from '@nanoviews/stores'
import { nanoStory } from '@nanoviews/storybook'
import { ul, li } from '../elements/elements.js'
import { for$ } from './for.js'

const meta: Meta<{
  items: ListStore<string[]>
}> = {
  title: 'Logic/for$',
  argTypes: {
    items: {
      $store: list
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render: nanoStory(() => ul()(
    for$([
      'Yatoro',
      'Larl',
      'Collapse',
      'Mira',
      'Miposhka'
    ])(
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
    for$(items)(
      item => li()(item),
      () => li()('No items')
    )
  ))
}

interface Player {
  id: number
  name: string
}

export const EntitiesValue: StoryObj<{
  items: EntitiesStore<Player[], RecordStore<Player | undefined>>
}> = {
  argTypes: {
    items: {
      $store: value => entities(value, record)
    }
  },
  args: {
    items: [
      {
        id: 1,
        name: 'Yatoro'
      },
      {
        id: 2,
        name: 'Larl'
      },
      {
        id: 3,
        name: 'Collapse'
      },
      {
        id: 4,
        name: 'Mira'
      },
      {
        id: 5,
        name: 'Miposhka'
      }
    ]
  },
  render: nanoStory(({ items }) => ul()(
    for$(items)(
      item => li()(item.name)
    )
  ))
}

