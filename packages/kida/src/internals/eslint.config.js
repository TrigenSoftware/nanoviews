import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  {
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'no-return-assign': 'off',
      'no-empty-function': 'off',
      'func-names': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'max-classes-per-file': 'off',
      '@typescript-eslint/prefer-string-starts-ends-with': 'off'
    }
  }
]
