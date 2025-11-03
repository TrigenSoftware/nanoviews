/* eslint-disable camelcase */
export const terserOptions = {
  module: true,
  mangle: false,
  format: {
    beautify: true,
    indent_level: 2,
    ecma: 2025,
    preserve_annotations: true,
    comments: 'all'
  },
  compress: {
    defaults: false,
    collapse_vars: true,
    comparisons: true,
    evaluate: true,
    hoist_props: true,
    reduce_vars: true,
    dead_code: true,
    unused: true
  }
}
