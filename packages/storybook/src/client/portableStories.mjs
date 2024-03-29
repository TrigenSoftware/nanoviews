import {
  composeStory as originalComposeStory,
  composeStories as originalComposeStories,
  setProjectAnnotations as originalSetProjectAnnotations
} from '@storybook/preview-api'
import * as defaultProjectAnnotations from './entryPreview.mjs'

export function setProjectAnnotations(projectAnnotations) {
  originalSetProjectAnnotations(projectAnnotations)
}

export function composeStory(story, componentAnnotations, projectAnnotations, exportsName) {
  return originalComposeStory(story, componentAnnotations, projectAnnotations, defaultProjectAnnotations, exportsName)
}

export function composeStories(csfExports, projectAnnotations) {
  const composedStories = originalComposeStories(csfExports, projectAnnotations, composeStory)

  return composedStories
}
