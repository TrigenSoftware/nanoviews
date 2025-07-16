import moduleConfig from '@trigen/eslint-config/module'
import tsTypeCheckedConfig from '@trigen/eslint-config/typescript-type-checked'
import testConfig from '@trigen/eslint-config/test'
import storybookConfig from '@trigen/eslint-config/storybook'
import env from '@trigen/eslint-config/env'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...moduleConfig,
  ...tsTypeCheckedConfig,
  ...testConfig,
  ...storybookConfig,
  env.node,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'no-implicit-coercion': 'off',
      'consistent-return': 'off',
      'no-cond-assign': 'off',
      'no-return-assign': 'off',
      'no-multi-assign': 'off',
      '@typescript-eslint/prefer-string-starts-ends-with': 'off',
      'no-param-reassign': 'off'
    }
  }
]
