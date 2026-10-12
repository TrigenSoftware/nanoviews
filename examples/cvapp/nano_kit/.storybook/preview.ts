import type { Preview } from '@nanoviews/storybook'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*'
    }
  }
}

export default preview
