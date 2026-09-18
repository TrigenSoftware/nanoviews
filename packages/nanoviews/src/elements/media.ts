import {
  type Accessor,
  deferEffect,
  isAccessor,
  isWritable
} from 'kida'
import {
  type Attributes,
  createElement,
  setAttribute
} from '../internals/index.js'

function setMediaAttribute(
  media: HTMLMediaElement,
  name: string,
  value: unknown
) {
  // The `muted` attribute is a default the browser reads once, when it
  // creates the element, so it is the property that is written. A writable
  // signal also receives what the user does with the controls
  if (name === 'muted') {
    if (isAccessor<Accessor<unknown>>(value)) {
      deferEffect(() => {
        media.muted = value() as boolean
      }, true)

      if (isWritable(value)) {
        media.addEventListener('volumechange', () => value(media.muted))
      }
    } else {
      media.muted = value as boolean
    }
  } else {
    setAttribute(media, name, value)
  }
}

/**
 * Describe an `audio`. `muted` is the live state of the element, bound
 * through the DOM property: a plain value is set once, an accessor is
 * followed, and a writable signal also receives what the user does with the
 * controls
 * @param attributes - Element attributes
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function audio(attributes?: Attributes<'audio'>) {
  return createElement('audio', attributes, setMediaAttribute)
}

/**
 * Describe a `video`. `muted` is the live state of the element, bound
 * through the DOM property: a plain value is set once, an accessor is
 * followed, and a writable signal also receives what the user does with the
 * controls
 * @param attributes - Element attributes
 * @returns Element description
 */
/* @__NO_SIDE_EFFECTS__ */
export function video(attributes?: Attributes<'video'>) {
  return createElement('video', attributes, setMediaAttribute)
}
