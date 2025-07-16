import commonjsConfig from '@trigen/eslint-config/commonjs'
import tsConfig from '@trigen/eslint-config/typescript'
import env from '@trigen/eslint-config/env'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...commonjsConfig,
  ...tsConfig,
  env.node
]
