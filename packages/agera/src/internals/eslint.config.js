import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-param-reassign': 'off',
      'no-label-var': 'off',
      'no-labels': 'off',
      'no-constant-condition': 'off',
      'no-multi-assign': 'off'
    }
  }
]
