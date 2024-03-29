import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { createElement } from '../elements/index.js'
import {
  createSlot,
  createSlotsSplitter as slots,
  getChildren
} from './children.js'

const meta: Meta = {
  title: 'Internals/Logic/Children'
}

export default meta

type Story = StoryObj<typeof meta>

export const NoChildren: Story = {
  render: nanoStory(
    () => getChildren(
      children => createElement('div')('No children:', children)
    )
  )
}

export const PrimitiveChild: Story = {
  render: nanoStory(
    () => getChildren(
      children => createElement('div')('Primitive child: ', children)
    )('Hello, world!')
  )
}

export const BlockChild: Story = {
  render: nanoStory(
    () => getChildren(
      children => createElement('div')('Block child: ', children)
    )(createElement('b')('Hello, world!'))
  )
}

export const Children: Story = {
  render: nanoStory(
    () => getChildren(
      children => createElement('div')('Children: ', children)
    )('Hello, ', createElement('b')('world!'))
  )
}

const testSlot = createSlot<string>()

export const NoSlot: Story = {
  render: nanoStory(
    () => getChildren(
      slots(testSlot),
      (testSlot, children) => createElement('div')('Children: ', children, testSlot)
    )('Hello!')
  )
}

export const Slot: Story = {
  render: nanoStory(
    () => getChildren(
      slots(testSlot),
      (testSlot, children) => createElement('div')('Children: ', children, testSlot)
    )('Hello! ', testSlot('World!'))
  )
}

const preSlot = createSlot<string>()
const postSlot = createSlot<string>()

export const Slots: Story = {
  render: nanoStory(
    () => getChildren(
      slots(preSlot, postSlot, testSlot),
      (preSlot, postSlot, testSlot, children) => createElement('div')(preSlot, children, testSlot, postSlot)
    )(
      'World! ',
      postSlot('From Slot!'),
      preSlot('Hello! ')
    )
  )
}
