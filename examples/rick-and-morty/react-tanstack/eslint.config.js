import bundlerConfig from '@trigen/eslint-config/bundler'
import tsConfig from '@trigen/eslint-config/typescript'
import env from '@trigen/eslint-config/env'
import rootConfig from '../../../eslint.config.js'

export default [
  ...rootConfig,
  ...bundlerConfig,
  ...tsConfig,
  env.node,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'import/no-default-export': 'off',
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'pathGroups': [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after'
            },
            {
              pattern: '#*/**',
              group: 'external',
              position: 'after'
            }
          ],
          'newlines-between': 'never'
        }
      ]
    }
  }
]
