import { defineConfig } from '@trigen/oxlint'
import bundlerConfig from '@trigen/oxlint-config/bundler'
import storybookConfig from '@trigen/oxlint-config/storybook'
import tsTypeCheckedConfig from '@trigen/oxlint-config/typescript-type-checked'
import rootConfig from '../../../oxlint.config.ts'

export default defineConfig({
  extends: [
    rootConfig,
    bundlerConfig,
    tsTypeCheckedConfig,
    storybookConfig
  ],
  env: {
    node: true
  },
  rules: {
    'typescript/no-invalid-void-type': 'off'
  }
})
