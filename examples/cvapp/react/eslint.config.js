import { globalIgnores } from 'eslint/config'
import baseConfig from '@trigen/eslint-config'
import bundlerConfig from '@trigen/eslint-config/bundler'
import reactConfig from '@trigen/eslint-config/react'
import tsTypeCheckedConfig from '@trigen/eslint-config/typescript-type-checked'
import testConfig from '@trigen/eslint-config/test'
import env from '@trigen/eslint-config/env'

export default [
  globalIgnores(['**/dist/']),
  ...baseConfig,
  ...bundlerConfig,
  ...reactConfig,
  ...tsTypeCheckedConfig,
  ...testConfig,
  env.browser,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-invalid-void-type': 'off'
    }
  }
]
