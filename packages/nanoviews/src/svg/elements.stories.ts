import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import { div } from '../elements/elements.js'
import {
  svg,
  circle,
  rect,
  path,
  a,
  title,
  text,
  foreignObject
} from './elements.js'

const meta: Meta<{
  radius: number
  color: string
}> = {
  title: 'SVG/Elements'
}

export default meta

type Story = StoryObj<typeof meta>

export const Shapes: Story = {
  render() {
    return (
      svg({
        width: 100,
        height: 100,
        viewBox: '0 0 100 100'
      })(
        rect({
          x: 10,
          y: 10,
          width: 80,
          height: 80,
          fill: '#eee'
        }),
        path({
          d: 'M20 80 L50 20 L80 80 Z',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2
        })
      )
    )
  }
}

export const ReactiveAttributes: Story = {
  args: {
    radius: 20,
    color: 'tomato'
  },
  render({ radius, color }) {
    return (
      svg({
        width: 100,
        height: 100,
        viewBox: '0 0 100 100'
      })(
        circle({
          cx: 50,
          cy: 50,
          r: radius,
          fill: color
        })
      )
    )
  }
}

export const SharedNames: Story = {
  render() {
    return (
      svg({
        width: 100,
        height: 100,
        viewBox: '0 0 100 100'
      })(
        title()('Link to nowhere'),
        a({
          href: '#'
        })(
          text({
            x: 10,
            y: 55
          })('Link')
        )
      )
    )
  }
}

export const ForeignObject: Story = {
  render() {
    return (
      svg({
        width: 100,
        height: 100,
        viewBox: '0 0 100 100'
      })(
        foreignObject({
          x: 0,
          y: 0,
          width: 100,
          height: 100
        })(
          div()('HTML inside')
        )
      )
    )
  }
}
