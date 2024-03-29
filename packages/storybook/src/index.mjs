import './client/globals.mjs'

export * from './client/portableStories.mjs'
export * from './client/nanoStory.mjs'

// optimization: stop HMR propagation in webpack
if (typeof module !== 'undefined') {
  module?.hot?.decline()
}
