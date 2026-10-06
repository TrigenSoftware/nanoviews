import { join } from 'node:path'
import postcssCustomMedia from 'postcss-custom-media'

export default {
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [postcssCustomMedia()]
    }
  },
  resolve: {
    alias: {
      '~': join(import.meta.dirname, 'src')
    }
  }
}
