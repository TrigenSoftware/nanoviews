import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, './package'],
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*']
    }
  }
})
