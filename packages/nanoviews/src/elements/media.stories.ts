import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { fn } from 'storybook/test'
import { effect$ } from '../component/effect.js'
import { video } from './media.js'

const meta: Meta<{
  muted?: boolean
  onChange?(value: unknown): void
}> = {
  title: 'Elements/Media'
}

export default meta

export const Video: StoryObj<{
  muted: boolean
  onChange(value: unknown): void
}> = {
  args: {
    onChange: fn(),
    muted: true
  },
  render({ onChange, muted }) {
    if (onChange && muted) {
      effect$((warmup) => {
        const v = muted()

        if (!warmup) {
          onChange(v)
        }
      })
    }

    return (
      video({
        controls: true,
        width: 320,
        muted
      })
    )
  }
}
