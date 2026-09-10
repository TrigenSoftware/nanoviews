import {
  describe,
  it,
  expect
} from 'vitest'
import { composeStories } from '@nanoviews/storybook'
import { render } from '@nanoviews/testing-library'
import { signal } from 'kida'
import * as Stories from './elements.stories.js'

const {
  Shapes,
  ReactiveAttributes,
  SharedNames,
  ForeignObject
} = composeStories(Stories)
const svgNamespace = 'http://www.w3.org/2000/svg'

describe('nanoviews', () => {
  describe('svg', () => {
    describe('elements', () => {
      it('should create elements in the svg namespace', () => {
        const { container } = render(Shapes())

        expect(container.querySelector('svg')).toBeInstanceOf(SVGSVGElement)
        expect(container.querySelector('rect')!.namespaceURI).toBe(svgNamespace)
        expect(container.querySelector('path')!.namespaceURI).toBe(svgNamespace)
      })

      it('should write attributes under their svg names', () => {
        const { container } = render(Shapes())

        expect(container.querySelector('svg')!.getAttribute('viewBox')).toBe('0 0 100 100')
        expect(container.querySelector('path')!.getAttribute('stroke-width')).toBe('2')
      })

      it('should update reactive attributes', () => {
        const radius = signal(20)
        const { container } = render(ReactiveAttributes({
          radius
        }))
        const circle = container.querySelector('circle')!

        expect(circle.getAttribute('r')).toBe('20')

        radius(40)

        expect(circle.getAttribute('r')).toBe('40')
      })

      it('should create svg elements for names shared with html', () => {
        const { container } = render(SharedNames())
        const anchor = container.querySelector('a')!

        expect(anchor.namespaceURI).toBe(svgNamespace)
        expect(anchor).not.toBeInstanceOf(HTMLElement)
        expect(container.querySelector('title')).toBeInstanceOf(SVGTitleElement)
      })

      it('should keep html children of foreignObject in the html namespace', () => {
        const { container } = render(ForeignObject())

        expect(container.querySelector('foreignObject')!.namespaceURI).toBe(svgNamespace)
        expect(container.querySelector('div')!.namespaceURI).toBe('http://www.w3.org/1999/xhtml')
      })
    })
  })
})
