import { defineConfig } from '@trigen/oxlint'
import moduleConfig from '@trigen/oxlint-config/module'
import testConfig from '@trigen/oxlint-config/test'
import tsTypeCheckedConfig from '@trigen/oxlint-config/typescript-type-checked'
import rootConfig from '../../oxlint.config.ts'

export default defineConfig({
  extends: [
    rootConfig,
    moduleConfig,
    tsTypeCheckedConfig,
    testConfig
  ],
  env: {
    node: true
  },
  rules: {
    'eslint/no-cond-assign': 'off',
    'eslint/no-multi-assign': 'off',
    'eslint/no-param-reassign': 'off',
    'import/export': 'off',
    'trigen/naming-convention': 'off'
  }
})
