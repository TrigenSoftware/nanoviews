import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { signal } from 'kida'
import {
  b,
  button
} from '../elements/elements.js'
import {
  case_,
  default_
} from './switch.js'
import { show_switch_ } from './showSwitch.js'

const meta: Meta<{
  tab: 'counter' | 'text' | 'other'
  text: string
}> = {
  title: 'Logic/show_switch_'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render() {
    return (
      show_switch_('counter')(
        case_('counter', () => b()('Counter')),
        case_('text', () => b()('Text')),
        default_(() => 'Other')
      )
    )
  }
}

export const ReactiveValue: Story = {
  args: {
    tab: 'counter'
  },
  render({ tab }) {
    return (
      show_switch_(tab)(
        case_('counter', () => b()('Counter')),
        case_('text', () => b()('Text')),
        default_(() => 'Other')
      )
    )
  }
}

export const ReactiveValueWithoutDefault: Story = {
  args: {
    tab: 'counter'
  },
  render({ tab }) {
    return (
      show_switch_(tab)(
        case_('counter', () => b()('Counter')),
        case_('text', () => b()('Text'))
      )
    )
  }
}

// Every case lives across the switches: the one that leaves is parked, not
// destroyed, so the counter keeps its count where `switch_` would reset it,
// and the bindings keep the parked text up to date
export const KeptAlive: Story = {
  args: {
    tab: 'counter',
    text: 'a'
  },
  render({
    tab,
    text
  }) {
    return (
      show_switch_(tab)(
        case_('counter', () => {
          const $count = signal(0)

          return button({
            onClick: () => $count($count() + 1)
          })(
            'Count: ', $count
          )
        }),
        case_('text', () => b()(text))
      )
    )
  }
}
