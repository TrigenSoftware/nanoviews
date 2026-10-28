import {
  describe,
  it,
  expect
} from 'vitest'
import { signal } from 'kida'
import { div } from '../elements/elements.js'
import { renderToString } from '../renderToString.js'
import {
  svg,
  path,
  circle,
  linearGradient,
  style,
  createElement,
  createVoidElement
} from './index.js'

describe('server', () => {
  describe('svg', () => {
    describe('element', () => {
      it('should write the attribute names SVG spells', () => {
        expect(renderToString(() => svg({
          viewBox: '0 0 24 24',
          width: 24
        })(
          path({
            d: 'M0 0',
            strokeWidth: 2,
            fill: 'none',
            class: ['icon', null]
          }),
          circle({
            cx: 1,
            tabIndex: 0,
            crossOrigin: 'anonymous'
          })
        ))).toBe('<svg viewBox="0 0 24 24" width="24"><path d="M0 0" stroke-width="2" fill="none" class="icon"></path><circle cx="1" tabindex="0" crossorigin="anonymous"></circle></svg>')
      })

      it('should leave event handlers out', () => {
        expect(renderToString(() => svg()(
          circle({
            r: 1,
            onClick() {
              throw new Error('Not called')
            }
          })
        ))).toBe('<svg><circle r="1"></circle></svg>')
      })

      it('should write an element without attributes', () => {
        expect(renderToString(() => svg()(
          circle()
        ))).toBe('<svg><circle></circle></svg>')
      })

      it('should describe elements by their tag names', () => {
        expect(renderToString(() => createElement('g', {
          id: 'group'
        })(
          createVoidElement('rect', {
            width: 1
          })
        ))).toBe('<g id="group"><rect width="1"></rect></g>')
      })

      it('should keep the case of the tags', () => {
        expect(renderToString(() => svg()(
          linearGradient({
            gradientUnits: 'userSpaceOnUse'
          })
        ))).toBe('<svg><linearGradient gradientUnits="userSpaceOnUse"></linearGradient></svg>')
      })

      it('should escape the text of an SVG style', () => {
        expect(renderToString(() => svg()(
          style()(
            'a > b & c'
          )
        ))).toBe('<svg><style>a > b &amp; c</style></svg>')
      })

      it('should write the current value of an accessor attribute in HTML', () => {
        const $radius = signal(4)

        expect(renderToString(() => div()(
          svg()(
            circle({
              r: $radius,
              style: {
                fill: 'red'
              }
            })
          )
        ))).toBe('<div><svg><circle r="4" style="fill:red"></circle></svg></div>')
      })
    })
  })
})
