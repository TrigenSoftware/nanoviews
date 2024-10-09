import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import type { Child } from '../types/index.js'
import { createElement } from '../elements/index.js'
import {
  createSlot,
  getSlots,
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

const testSlot = createSlot<string, 'test'>()

export const NoSlot: Story = {
  render: nanoStory(
    () => getChildren(
      (children) => {
        const [testChild, restChildren] = getSlots([testSlot], children)

        return createElement('div')('Children: ', restChildren, testChild)
      }
    )('Hello!')
  )
}

type SlotStoryChildren = (Child | ReturnType<typeof testSlot>)[]

export const Slot: Story = {
  render: nanoStory(
    () => getChildren<HTMLDivElement, SlotStoryChildren>(
      (children) => {
        const [testChild, restChildren] = getSlots([testSlot], children)

        return createElement('div')('Children: ', restChildren, testChild)
      }
    )('Hello! ', testSlot('World!'))
  )
}

const preSlot = createSlot<string, 'pre'>()
const postSlot = createSlot<string, 'post'>()

type SlotsStoryChildren = (Child | ReturnType<typeof preSlot> | ReturnType<typeof postSlot> | ReturnType<typeof testSlot>)[]

export const Slots: Story = {
  render: nanoStory(
    () => getChildren<HTMLDivElement, SlotsStoryChildren>(
      (children) => {
        const [
          preChild,
          postChild,
          testChild,
          restChildren
        ] = getSlots([
          preSlot,
          postSlot,
          testSlot
        ], children)

        return createElement('div')(preChild, restChildren, testChild, postChild)
      }
    )(
      'World! ',
      postSlot('From Slot!'),
      preSlot('Hello! ')
    )
  )
}
