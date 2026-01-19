import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  build: {
    target: 'esnext',
    minify: true
  },
  plugins: [solid()]
})
