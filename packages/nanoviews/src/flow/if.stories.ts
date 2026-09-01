import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { b } from '../elements/elements.js'
import { if_ } from './if.js'

const meta: Meta<{
  value: boolean
}> = {
  title: 'Logic/if_'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticValue: Story = {
  render() {
    return (
      if_(true)(
        () => b()('True'),
        () => 'False'
      )
    )
  }
}

export const ReactiveValue: Story = {
  args: {
    value: true
  },
  render({ value }) {
    return (
      if_(value)(
        $val => b()('True: ', $val),
        () => 'False'
      )
    )
  }
}

export const ReactiveValueThenOnly: Story = {
  args: {
    value: true
  },
  render({ value }) {
    return (
      if_(value)(
        $val => b()('True: ', $val)
      )
    )
  }
}
