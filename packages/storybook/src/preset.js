const { join } = require('path')

exports.previewAnnotations = function previewAnnotations(input = []) {
  return [...input, join(__dirname, 'client', 'entryPreview.mjs')]
}
