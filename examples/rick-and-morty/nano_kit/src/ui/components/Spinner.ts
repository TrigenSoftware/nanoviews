import {
  div,
  component$
} from 'nanoviews'

export const Spinner = component$((_, children) => div({
  class: 'spinner-loading'
})(
  div({
    class: 'spinner-spinner'
  }),
  ...children
))
