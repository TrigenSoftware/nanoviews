import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import { DEV } from '../../scripts/index.js'

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      formats: ['es'],
      entry: {
        index: './src/index.ts'
      }
    },
    rollupOptions: {
      external: ['@nano_kit/store']
    },
    sourcemap: true,
    minify: !DEV && 'esbuild',
    emptyOutDir: false
  },
  test: {
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude, './package'],
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*']
    }
  }
})
