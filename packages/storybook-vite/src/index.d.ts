import type { StorybookConfig as StorybookConfigBase } from '@storybook/types'
import type { StorybookConfigVite, BuilderOptions } from '@storybook/builder-vite'

type FrameworkName = '@nanoviews/storybook-vite'
type BuilderName = '@storybook/builder-vite'

export interface FrameworkOptions {
  builder?: BuilderOptions
}

interface StorybookConfigFramework {
  framework: FrameworkName | {
    name: FrameworkName
    options: FrameworkOptions
  }
  core?: StorybookConfigBase['core'] & {
    builder?: BuilderName | {
      name: BuilderName;
      options: BuilderOptions;
    }
  }
}

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigVite | keyof StorybookConfigFramework
> & StorybookConfigVite & StorybookConfigFramework
