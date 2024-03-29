import type { StorybookConfig } from '@nanoviews/storybook-vite'

const config: StorybookConfig = {
  framework: '@nanoviews/storybook-vite',
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials']
}

export default config
