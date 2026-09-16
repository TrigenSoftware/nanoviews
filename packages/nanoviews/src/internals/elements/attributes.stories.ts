import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { signal } from 'kida'
import { button } from '../../elements/elements.js'

const meta: Meta = {
  title: 'Internals/Elements/Attributes'
}

export default meta

type Story = StoryObj<typeof meta>

export const AutoFocus: Story = {
  render() {
    return (
      button({
        autoFocus: true
      })(
        'Focused'
      )
    )
  }
}

export const ReactiveAutoFocus: Story = {
  render() {
    return (
      button({
        autoFocus: signal(true)
      })(
        'Focused'
      )
    )
  }
}
