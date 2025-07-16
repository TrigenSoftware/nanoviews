import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  {
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      'no-cond-assign': 'off',
      'no-return-assign': 'off',
      'no-multi-assign': 'off',
      'max-classes-per-file': 'off',
      'no-param-reassign': 'off',
      'consistent-this': 'off'
    }
  }
]
