import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import {
  type Signalish,
  signal,
  provide,
  inject,
  when
} from 'kida'
import type {
  Attributes,
  Child
} from '../internals/types/index.js'
import {
  div,
  p,
  b,
  button,
  ul,
  li
} from '../elements/index.js'
import { component$ } from './component.js'
import { context$ } from './context.js'

const meta: Meta<{
  name: string
}> = {
  title: 'Component/Component'
}

export default meta

type Story = StoryObj<typeof meta>

const Card = component$((props: Attributes<'div'>, children) => div(props)(
  ...children.length ? children : ['empty']
))

export const WithChildren: Story = {
  render() {
    return (
      Card({
        class: 'card'
      })(
        'Hello, ',
        b()('world')
      )
    )
  }
}

export const WithoutChildren: Story = {
  render() {
    return (
      div()(
        Card({
          class: 'card'
        })
      )
    )
  }
}

interface GreetingProps extends Attributes<'p'> {
  name: Signalish<string>
  excited?: Signalish<boolean>
}

// The props go on as they came: a child takes a plain value and a signal
// alike, and so does `when`, which returns a plain value for plain operands
const Greeting = component$(({
  name,
  excited,
  ...props
}: GreetingProps) => p(props)(
  'Hello, ', name, when(excited, '!', '.')
))

export const Props: Story = {
  args: {
    name: 'world'
  },
  render({ name }) {
    return (
      Greeting({
        name,
        excited: true,
        id: 'greeting'
      })
    )
  }
}

const Counter = component$((_, children) => {
  const $count = signal(0)

  return (
    button({
      onClick() {
        $count($count() + 1)
      }
    })(
      ...children, ' ', $count
    )
  )
})

export const NoProps: Story = {
  render() {
    return Counter()('Count:')
  }
}

const SegmentedValue$ = () => signal('')
const SegmentedControl = component$<{
  $value: ReturnType<typeof SegmentedValue$>
}>(({ $value }, children) => context$(
  provide(SegmentedValue$, $value)
)(
  div({
    role: 'tablist'
  })(
    ...children
  )
))
const Segment = component$<{
  value: string
}>(({ value }, children) => {
  const $value = inject(SegmentedValue$)

  return (
    button({
      'role': 'tab',
      'aria-selected': () => $value() === value,
      'onClick': () => $value(value)
    })(
      ...children
    )
  )
})

export const ProvidedThroughChildren: Story = {
  render() {
    const $tab = signal('signals')

    return (
      SegmentedControl({
        $value: $tab
      })(
        Segment({
          value: 'signals'
        })(
          'Signals'
        ),
        Segment({
          value: 'log'
        })(
          'Log'
        )
      )
    )
  }
}

const List = component$<{
  items: string[]
}, [renderItem: (item: string) => Child]>(({ items }, [renderItem]) => ul()(
  ...items.map(item => li()(renderItem(item)))
))

export const TypedChildren: Story = {
  render() {
    return (
      List({
        items: ['chopper', 'magixx', 'donk']
      })(
        item => b()('Player: ', item)
      )
    )
  }
}
