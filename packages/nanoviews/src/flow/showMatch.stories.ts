import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import {
  type Signalish,
  signal
} from 'kida'
import {
  b,
  i,
  button
} from '../elements/elements.js'
import { default_ } from './switch.js'
import { when_ } from './match.js'
import { show_match_ } from './showMatch.js'

// The cases are `Signalish` so a story can take a plain accessor too: that is
// what a test counts the walks with
const meta: Meta<{
  loading: Signalish<boolean>
  error: Signalish<boolean>
}> = {
  title: 'Logic/show_match_'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render() {
    return (
      show_match_(
        when_(0, () => b()('Zero')),
        when_('ready', () => b()('Ready')),
        default_(() => 'Nothing')
      )
    )
  }
}

export const ReactiveValue: Story = {
  args: {
    loading: true,
    error: false
  },
  render({
    loading,
    error
  }) {
    return (
      show_match_(
        when_(loading, () => i()('Loading')),
        when_(error, () => b()('Error')),
        default_(() => 'Ready')
      )
    )
  }
}

export const ReactiveValueWithoutDefault: Story = {
  args: {
    loading: true,
    error: false
  },
  render({
    loading,
    error
  }) {
    return (
      show_match_(
        when_(loading, () => i()('Loading')),
        when_(error, () => b()('Error'))
      )
    )
  }
}

// Every case lives across the flips: the counter keeps its count while the
// loading case is shown, where `match_` would reset it
export const KeptAlive: Story = {
  args: {
    loading: false,
    error: false
  },
  render({
    loading,
    error
  }) {
    return (
      show_match_(
        when_(loading, () => i()('Loading')),
        when_(error, () => b()('Error')),
        default_(() => {
          const $count = signal(0)

          return button({
            onClick: () => $count($count() + 1)
          })(
            'Count: ', $count
          )
        })
      )
    )
  }
}
