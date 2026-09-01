import { enhanceArgTypes } from 'storybook/internal/docs-tools'

export const parameters = {
  renderer: 'nanoviews'
}

export {
  applyDecorators,
  render,
  renderToCanvas
} from './render.js'

export const argTypesEnhancers = [enhanceArgTypes]
