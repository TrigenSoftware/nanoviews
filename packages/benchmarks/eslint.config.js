import moduleConfig from '@trigen/eslint-config/module'
import env from '@trigen/eslint-config/env'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...moduleConfig,
  env.node,
  {
    rules: {
      'no-console': 'off',
      'no-magic-numbers': 'off',
      'no-unused-vars': 'off'
    }
  }
]
