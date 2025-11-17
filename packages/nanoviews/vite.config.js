import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import { DEV } from '../../scripts/index.js'

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      formats: ['es'],
      entry: {
        index: './src/index.ts',
        store: './src/store.ts'
      }
    },
    rollupOptions: {
      external: ['agera', 'kida']
    },
    sourcemap: true,
    minify: !DEV && 'esbuild',
    emptyOutDir: false
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    exclude: [...configDefaults.exclude, './package'],
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*', '!**/*.stories.ts']
    }
  }
})
