import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { fn } from 'storybook/test'
import type { MouseEventHandler } from '../types/index.js'
import { createElement } from './element.js'

const meta: Meta<{
  text: string
  href: string | undefined
  onClick: MouseEventHandler
}> = {
  title: 'Internals/Elements/Element'
}

export default meta

type Story = StoryObj<typeof meta>

export const StaticPrimitiveChild: Story = {
  render() {
    return createElement('b')('Hello, world!')
  }
}

export const ReactivePrimitiveChild: Story = {
  args: {
    text: 'Hello, world!'
  },
  render({ text }) {
    return createElement('b')(text)
  }
}

export const StaticPrimitiveAttribute: Story = {
  render() {
    return (
      createElement('a', {
        href: '#'
      })(
        'Link!'
      )
    )
  }
}

export const ReactivePrimitiveAttribute: Story = {
  args: {
    href: '#'
  },
  render({ href }) {
    return (
      createElement('a', {
        href
      })(
        'Link!'
      )
    )
  }
}

export const Events: Story = {
  args: {
    onClick: fn(),
    text: 'Click me!'
  },
  render({ onClick, text }) {
    return (
      createElement('button', {
        onClick
      })(
        text
      )
    )
  }
}

export const Children: Story = {
  render() {
    return (
      createElement('ul')(
        createElement('li')('One'),
        createElement('li')('Two'),
        createElement('li')('Three')
      )
    )
  }
}

export const NoChildren: Story = {
  render() {
    return (
      createElement('div')(
        createElement('hr'),
        '^ hr, br >',
        createElement('br'),
        '^ br, hr >',
        createElement('hr')
      )
    )
  }
}
