import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import type { Signalish } from 'kida'
import { button } from '../elements/elements.js'
import { props$ } from './props.js'
import { component$ } from './component.js'

interface BadgeProps {
  label: Signalish<string>
  count?: Signalish<number>
}

const Badge = component$((props: BadgeProps) => {
  const {
    $label,
    $count = () => 0
  } = props$(props)

  return button()($label, ': ', $count)
})
const meta: Meta<typeof Badge> = {
  title: 'Component/Props',
  // The args come from the component: a `Signalish` prop takes a plain value,
  // and `render` gets it back as a signal the component accepts
  component: Badge
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Unread',
    count: 3
  }
}

export const CustomRender: Story = {
  args: {
    label: 'Unread'
  },
  render({
    label,
    count
  }) {
    return Badge({
      label,
      count
    })
  }
}
