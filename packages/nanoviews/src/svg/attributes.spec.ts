import {
  describe,
  it,
  expect
} from 'vitest'
import { signal } from 'kida'
import { setAttributes } from './attributes.js'

function createElement(attributes: object) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  setAttributes(element, attributes)

  return element
}

describe('nanoviews', () => {
  describe('svg', () => {
    describe('attributes', () => {
      describe('setAttributes', () => {
        it('should hyphenate presentation attributes', () => {
          const element = createElement({
            strokeWidth: 2,
            fillOpacity: 0.5,
            fontSize: 12,
            textAnchor: 'middle',
            clipPath: 'url(#clip)',
            markerEnd: 'url(#arrow)',
            colorInterpolationFilters: 'sRGB'
          })

          expect(element.getAttribute('stroke-width')).toBe('2')
          expect(element.getAttribute('fill-opacity')).toBe('0.5')
          expect(element.getAttribute('font-size')).toBe('12')
          expect(element.getAttribute('text-anchor')).toBe('middle')
          expect(element.getAttribute('clip-path')).toBe('url(#clip)')
          expect(element.getAttribute('marker-end')).toBe('url(#arrow)')
          expect(element.getAttribute('color-interpolation-filters')).toBe('sRGB')
          expect(element.hasAttribute('strokeWidth')).toBe(false)
        })

        it('should keep camel case of element attributes', () => {
          const element = createElement({
            viewBox: '0 0 1 1',
            preserveAspectRatio: 'none',
            markerWidth: 3,
            textLength: 10,
            clipPathUnits: 'userSpaceOnUse',
            gradientUnits: 'userSpaceOnUse'
          })

          expect(element.getAttribute('viewBox')).toBe('0 0 1 1')
          expect(element.getAttribute('preserveAspectRatio')).toBe('none')
          expect(element.getAttribute('markerWidth')).toBe('3')
          expect(element.getAttribute('textLength')).toBe('10')
          expect(element.getAttribute('clipPathUnits')).toBe('userSpaceOnUse')
          expect(element.getAttribute('gradientUnits')).toBe('userSpaceOnUse')
        })

        it('should lowercase tabIndex and crossOrigin', () => {
          const element = createElement({
            tabIndex: 0,
            crossOrigin: 'anonymous'
          })

          expect(element.getAttribute('tabindex')).toBe('0')
          expect(element.getAttribute('crossorigin')).toBe('anonymous')
        })

        it('should map the name of a reactive attribute once', () => {
          const $width = signal(1)
          const element = createElement({
            strokeWidth: $width
          })

          expect(element.getAttribute('stroke-width')).toBe('1')

          $width(3)

          expect(element.getAttribute('stroke-width')).toBe('3')
          expect(element.hasAttribute('strokeWidth')).toBe(false)
        })
      })
    })
  })
})
