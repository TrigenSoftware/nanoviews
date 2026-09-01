import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import type { Attributes } from '../internals/types/index.js'
import {
  createElement,
  main,
  header,
  footer
} from '../elements/index.js'
import {
  children$,
  slot$,
  slots$,
  getSlots
} from './children.js'

const meta: Meta = {
  title: 'Component/Children'
}

export default meta

type Story = StoryObj<typeof meta>

const TestSlot = (text: string) => slot$(TestSlot, text)

export const NoSlot: Story = {
  render() {
    const [testChild, restChildren] = getSlots([TestSlot], ['Hello!'])

    return (
      createElement('div')(
        'Children: ',
        ...restChildren,
        testChild
      )
    )
  }

}

export const Slot: Story = {
  render() {
    const [testChild, restChildren] = getSlots([TestSlot], ['Hello! ', TestSlot('World!')])

    return (
      createElement('div')(
        'Children: ',
        ...restChildren,
        testChild
      )
    )
  }

}

const PreSlot = (text: string) => slot$(PreSlot, text)
const PostSlot = (text: string) => slot$(PostSlot, text)

export const Slots: Story = {
  render() {
    const [
      preChild,
      postChild,
      testChild,
      restChildren
    ] = getSlots([
      PreSlot,
      PostSlot,
      TestSlot
    ], [
      'World! ',
      PostSlot('From Slot!'),
      PreSlot('Hello! ')
    ])

    return (
      createElement('div')(
        preChild,
        ...restChildren,
        testChild,
        postChild
      )
    )
  }

}

function LayoutHeader(props: Attributes<'header'>) {
  return children$(children => slot$(LayoutHeader, header(props)(
    ...children
  )))
}

function LayoutFooter(props: Attributes<'footer'>) {
  return children$(children => slot$(LayoutFooter, footer(props)(
    ...children
  )))
}

function Layout() {
  return slots$(
    [LayoutHeader, LayoutFooter],
    (headerSlot, footerSlot, children) => main()(
      headerSlot,
      ...children,
      footerSlot
    )
  )
}

export const ComponentSlots: Story = {
  render() {
    return (
      Layout()(
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

export const UndeclaredSlot: Story = {
  render() {
    return (
      slots$(
        [LayoutHeader],
        (headerSlot, children) => main()(
          headerSlot,
          ...children
        )
      )(
        LayoutHeader({})('Header content'),
        LayoutFooter({})('Footer content')
      )
    )
  }

}
