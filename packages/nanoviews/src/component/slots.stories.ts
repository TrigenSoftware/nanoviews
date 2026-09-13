import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import {
  type WritableSignal,
  signal,
  provide,
  inject
} from 'kida'
import type {
  Attributes,
  Child
} from '../internals/types/index.js'
import {
  div,
  main,
  header,
  footer,
  b,
  button
} from '../elements/index.js'
import { component$ } from './component.js'
import { context$ } from './context.js'
import {
  slot$,
  slots$,
  getSlots
} from './slots.js'

const meta: Meta = {
  title: 'Component/Slots'
}

export default meta

type Story = StoryObj<typeof meta>

const TestSlot = slot$((_, children) => b()(...children))
const PreSlot = slot$((_, children) => b()(...children))
const PostSlot = slot$((_, children) => b()(...children))

export const NoSlot: Story = {
  render() {
    const [testSlot, rest] = getSlots([TestSlot], ['Hello!'])

    return div()(
      'Children: ', ...rest, testSlot
    )
  }
}

export const Slot: Story = {
  render() {
    const [testSlot, rest] = getSlots([TestSlot], ['Hello! ', TestSlot()('World!')])

    return div()(
      'Children: ', ...rest, testSlot
    )
  }
}

export const Slots: Story = {
  render() {
    const [
      preSlot,
      postSlot,
      testSlot,
      rest
    ] = getSlots([
      PreSlot,
      PostSlot,
      TestSlot
    ], [
      'World! ',
      PostSlot()('From Slot!'),
      PreSlot()('Hello! ')
    ])

    return div()(
      preSlot, ...rest, testSlot, postSlot
    )
  }
}

const LayoutHeader = slot$<Attributes<'header'>>((props, children) => header(props)(...children))
const LayoutFooter = slot$<Attributes<'footer'>>((props, children) => footer(props)(...children))
const Layout = component$(slots$(
  [LayoutHeader, LayoutFooter],
  (props: Attributes<'main'>, headerSlot, footerSlot, children) => main(props)(
    headerSlot,
    ...children,
    footerSlot
  )
))

export const ComponentSlots: Story = {
  render() {
    return (
      Layout({
        class: 'page'
      })(
        LayoutHeader({
          'data-testid': 'header'
        })(
          'Header content'
        ),
        'Main content',
        LayoutFooter({
          'data-testid': 'footer'
        })(
          'Footer content'
        )
      )
    )
  }
}

export const UncalledSlot: Story = {
  render() {
    return (
      Layout()(
        LayoutHeader({
          'data-testid': 'header'
        }),
        'Main content'
      )
    )
  }
}

export const UndeclaredSlot: Story = {
  render() {
    const HeaderOnly = component$(slots$(
      [LayoutHeader],
      (_, headerSlot, children) => main()(headerSlot, ...children)
    ))

    return (
      HeaderOnly()(
        LayoutHeader()('Header content'),
        LayoutFooter()('Footer content')
      )
    )
  }
}

export const StandaloneSlot: Story = {
  render() {
    return (
      div()(
        LayoutHeader({
          class: 'alone'
        })(
          'Alone'
        )
      )
    )
  }
}

const Draft$ = () => signal('')
const Footer = slot$<object, [render: (draft: WritableSignal<string>) => Child]>((_, [render]) => render(inject(Draft$)))
const Modal = component$(slots$(
  [Footer],
  (props: Attributes<'div'>, footerSlot, children) => {
    const $draft = signal('draft')

    return (
      context$(
        provide(Draft$, $draft)
      )(
        div({
          ...props,
          role: 'dialog'
        })(
          ...children,
          footerSlot
        )
      )
    )
  }
))

export const SlotThroughContext: Story = {
  render() {
    return (
      Modal()(
        'Edit',
        Footer()($draft => button()('Save ', $draft))
      )
    )
  }
}
