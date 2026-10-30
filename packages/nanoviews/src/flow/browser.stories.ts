import type {
  Meta,
  StoryObj
} from '@nanoviews/storybook'
import {
  b,
  i
} from '../elements/elements.js'
import { browser_ } from './browser.js'

const meta: Meta = {
  title: 'Logic/browser_'
}

export default meta

type Story = StoryObj<typeof meta>

// The language is known in the browser only: the server writes the fallback
// instead, and hydration replaces it with the child
export const Language: Story = {
  render() {
    return browser_(
      () => b()(
        navigator.language
      ),
      () => i()(
        'Detecting the language…'
      )
    )
  }
}
