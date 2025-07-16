import commonjsConfig from '@trigen/eslint-config/commonjs'
import tsConfig from '@trigen/eslint-config/typescript'
import env from '@trigen/eslint-config/env'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...commonjsConfig,
  ...tsConfig,
  env.node,
  {
    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off'
    }
  }
]
