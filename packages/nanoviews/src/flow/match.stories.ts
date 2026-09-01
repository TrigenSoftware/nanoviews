import type { Signalish } from 'kida'
import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import {
  b,
  i
} from '../elements/elements.js'
import { default_ } from './switch.js'
import {
  when_,
  match_
} from './match.js'

// The cases are `Signalish` so a story can take a plain accessor too: that is
// what a test counts the walks with
const meta: Meta<{
  loading: Signalish<boolean>
  error: Signalish<boolean>
  post: { title: string } | null
}> = {
  title: 'Logic/match_'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render() {
    return (
      match_(
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
      match_(
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
      match_(
        when_(loading, () => i()('Loading')),
        when_(error, () => b()('Error'))
      )
    )
  }
}

export const CaseValue: Story = {
  args: {
    post: null
  },
  render({ post }) {
    return (
      match_(
        when_(post, $post => b()(() => $post().title)),
        default_(() => 'No post')
      )
    )
  }
}
