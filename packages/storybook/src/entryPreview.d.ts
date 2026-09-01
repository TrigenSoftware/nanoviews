import type { ArgTypesEnhancer } from 'storybook/internal/types'

export const parameters: {
  renderer: 'nanoviews'
}

export {
  applyDecorators,
  render,
  renderToCanvas
} from './render.js'

export const argTypesEnhancers: ArgTypesEnhancer[]
