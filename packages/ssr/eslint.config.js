import moduleConfig from '@trigen/eslint-config/module'
import tsTypeCheckedConfig from '@trigen/eslint-config/typescript-type-checked'
import testConfig from '@trigen/eslint-config/test'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...moduleConfig,
  ...tsTypeCheckedConfig,
  ...testConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/reject-any-type': 'off',
      'import/no-default-export': 'off',
      'consistent-return': 'off',
      'no-magic-numbers': 'off',
      'no-return-assign': 'off',
      'no-console': 'off'
    }
  }
]
