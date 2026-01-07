import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { DEV } from '../../scripts/index.js'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    lib: {
      formats: ['es'],
      entry: {
        index: './src/index.tsx'
      }
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        '@nano_kit/store',
        '@nano_kit/router',
        '@nano_kit/react'
      ]
    },
    sourcemap: true,
    minify: !DEV && 'esbuild',
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
