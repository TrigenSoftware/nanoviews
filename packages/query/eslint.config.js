import moduleConfig from '@trigen/eslint-config/module'
import tsTypeCheckedConfig from '@trigen/eslint-config/typescript-type-checked'
import testConfig from '@trigen/eslint-config/test'
import env from '@trigen/eslint-config/env'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...moduleConfig,
  ...tsTypeCheckedConfig,
  ...testConfig,
  env.node,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'no-cond-assign': 'off',
      'no-multi-assign': 'off',
      'consistent-return': 'off',
      'no-return-assign': 'off',
      'max-classes-per-file': 'off',
      'func-names': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/unified-signatures': 'off'
    }
  }
]
