const { dirname, join } = require('path')

function getAbsolutePath(input) {
  return dirname(require.resolve(join(input, 'package.json')))
}

exports.core = {
  builder: getAbsolutePath('@storybook/builder-vite'),
  renderer: getAbsolutePath('@nanoviews/storybook')
}
