import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { signal } from 'kida'
import { div } from '../../elements/elements.js'
import { input } from '../../elements/controls.js'

const meta: Meta<{
  color: string
  bold: boolean
}> = {
  title: 'Internals/Elements/Attributes'
}

export default meta

type Story = StoryObj<typeof meta>

export const AutoFocus: Story = {
  render() {
    return (
      input({
        autoFocus: true,
        value: 'Hello, world!'
      })
    )
  }
}

export const ReactiveAutoFocus: Story = {
  render() {
    return (
      input({
        autoFocus: signal(true),
        value: 'Hello, world!'
      })
    )
  }
}

export const StaticStyle: Story = {
  render() {
    return (
      div({
        style: {
          color: 'green'
        }
      })(
        'Hello, world!'
      )
    )
  }
}

export const ReactiveStyle: Story = {
  args: {
    color: 'green'
  },
  render({ color }) {
    return (
      div({
        style: () => ({
          color: color()
        })
      })(
        'Hello, world!'
      )
    )
  }
}

export const StyleCustomProperties: Story = {
  args: {
    color: 'green'
  },
  render({ color }) {
    return (
      div({
        style: () => ({
          '--accent': color(),
          '--gap': '4px'
        })
      })(
        'Hello, world!'
      )
    )
  }
}

export const StyleMultiWordProperties: Story = {
  args: {
    color: 'green'
  },
  render({ color }) {
    return (
      div({
        style: () => ({
          backgroundColor: color(),
          fontSize: '12px'
        })
      })(
        'Hello, world!'
      )
    )
  }
}

export const StyleChangingShape: Story = {
  args: {
    bold: true
  },
  render({ bold }) {
    return (
      div({
        style: () => (
          bold()
            ? {
              fontWeight: 'bold',
              color: 'red'
            }
            : {
              color: 'blue'
            }
        )
      })(
        'Hello, world!'
      )
    )
  }
}
