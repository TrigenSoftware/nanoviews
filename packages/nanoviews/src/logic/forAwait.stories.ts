import type { Meta, StoryObj } from '@nanoviews/storybook'
import type { WritableAtom } from 'nanostores'
import { nanoStory } from '@nanoviews/storybook'
import { ul, li, b } from '../elements/elements.js'
import { forAwait$ } from './forAwait.js'
import {
  pending$,
  each$,
  then$,
  catch$
} from './async.js'

type AtomStream = AsyncIterable<string> | WritableAtom<AsyncIterable<string>>

function mockStream(
  getItem: (index: number) => Promise<string>,
  times: number
) {
  return async function* stream() {
    for (let i = 0; i < times; i++) {
      yield getItem(i)
    }
  }
}

const meta: Meta<{
  getStream(): AtomStream
}> = {
  title: 'Logic/forAwait$'
}

export default meta

type Story = StoryObj<typeof meta>

function Demo({ getStream }: { getStream(): AtomStream }) {
  return ul()(
    forAwait$(getStream())(
      pending$(() => b()('Loading...')),
      each$((value, i) => li()(`Item #${i}: ${value}`)),
      then$(value => b()('Total: ', value)),
      catch$(error => b()('Rejected: ', String(error)))
    )
  )
}

export const PendingState: Story = {
  args: {
    getStream: mockStream(() => new Promise(() => { /* pending */ }), 3)
  },
  render: nanoStory(Demo)
}

export const InProgressState: Story = {
  args: {
    getStream: mockStream((i) => {
      if (i > 1) {
        return new Promise(() => { /* pending */ })
      }

      return Promise.resolve(`${i * i}`)
    }, 3)
  },
  render: nanoStory(Demo)
}

export const ResolvedState: Story = {
  args: {
    getStream: mockStream(i => Promise.resolve(`${i * i}`), 3)
  },
  render: nanoStory(Demo)
}

export const RejectedState: Story = {
  args: {
    getStream: mockStream(() => Promise.reject(new Error('Something wend wrong!')), 3)
  },
  render: nanoStory(Demo)
}

export const RejectedInProgressState: Story = {
  args: {
    getStream: mockStream((i) => {
      if (i > 1) {
        return Promise.reject(new Error('Something wend wrong!'))
      }

      return Promise.resolve(`${i * i}`)
    }, 3)
  },
  render: nanoStory(Demo)
}

function delayedResolve(value: string, delay: number) {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(value), delay)
  })
}

export const DelayedResolve: Story = {
  args: {
    getStream: mockStream(i => delayedResolve(`${i * i}`, 2000), 3)
  },
  render: nanoStory(Demo)
}

function delayedReject(error: Error, delay: number) {
  return new Promise<string>((_, reject) => {
    setTimeout(() => reject(error), delay)
  })
}

export const DelayedReject: Story = {
  args: {
    getStream: mockStream((i) => {
      if (i > 1) {
        return delayedReject(new Error('Something wend wrong!'), 2000)
      }

      return delayedResolve(`${i * i}`, 2000)
    }, 3)
  },
  render: nanoStory(Demo)
}
