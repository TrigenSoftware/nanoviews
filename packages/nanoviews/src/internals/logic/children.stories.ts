import type { Meta, StoryObj } from '@nanoviews/storybook'
import { nanoStory } from '@nanoviews/storybook'
import { createElement } from '../elements/index.js'
import {
  createSlot,
  getSlots
} from './children.js'

const meta: Meta = {
  title: 'Internals/Logic/Children'
}

export default meta

type Story = StoryObj<typeof meta>

const TestSlot = (text: string) => createSlot(TestSlot, text)

export const NoSlot: Story = {
  render: nanoStory(
    () => {
      const [testChild, restChildren] = getSlots([TestSlot], ['Hello!'])

      return createElement('div')('Children: ', ...restChildren, testChild)
    }
  )
}

export const Slot: Story = {
  render: nanoStory(
    () => {
      const [testChild, restChildren] = getSlots([TestSlot], ['Hello! ', TestSlot('World!')])

      return createElement('div')('Children: ', ...restChildren, testChild)
    }
  )
}

const PreSlot = (text: string) => createSlot(PreSlot, text)
const PostSlot = (text: string) => createSlot(PostSlot, text)

export const Slots: Story = {
  render: nanoStory(
    () => {
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

      return createElement('div')(preChild, ...restChildren, testChild, postChild)
    }
  )
}
