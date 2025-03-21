import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'esnext',
    minify: true
  }
  // resolve: {
  //   alias: {
  //     'nanoviews/store': '../../packages/nanoviews/dist/store.js',
  //     'nanoviews': '../../packages/nanoviews/dist/index.js',
  //     'kida': '../../packages/kida/dist/index.js',
  //     'agera': '../../packages/agera/dist/index.js'
  //   }
  // }
})
