import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

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
    minify: false,
    emptyOutDir: false
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['@testing-library/jest-dom/vitest'],
    exclude: [...configDefaults.exclude, './package'],
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*']
    }
  }
})
