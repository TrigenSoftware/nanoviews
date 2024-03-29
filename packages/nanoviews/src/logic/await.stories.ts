import type { Meta, StoryObj } from '@nanoviews/storybook'
import type { WritableAtom } from 'nanostores'
import { nanoStory } from '@nanoviews/storybook'
import { p, b } from '../elements/elements.js'
import { await$ } from './await.js'
import {
  pending$,
  then$,
  catch$
} from './async.js'

type AtomPromise = Promise<string> | WritableAtom<Promise<string>>

const meta: Meta<{
  getPromise(): AtomPromise
}> = {
  title: 'Logic/await$'
}

export default meta

type Story = StoryObj<typeof meta>

function Demo({ getPromise }: { getPromise(): AtomPromise }) {
  return await$(getPromise())(
    pending$(() => b()('Loading...')),
    then$(value => p()('Resolved: ', value)),
    catch$(error => p()('Rejected: ', String(error)))
  )
}

export const PendingState: Story = {
  args: {
    getPromise: () => new Promise(() => { /* pending */ })
  },
  render: nanoStory(Demo)
}

export const ResolvedState: Story = {
  args: {
    getPromise: () => Promise.resolve('Hello, world!')
  },
  render: nanoStory(Demo)
}

export const RejectedState: Story = {
  args: {
    getPromise: () => Promise.reject(new Error('Something went wrong!'))
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
    getPromise: () => delayedResolve('Nanoviews can promises!', 2000)
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
    getPromise: () => delayedReject(new Error('Something went wrong!'), 2000)
  },
  render: nanoStory(Demo)
}
