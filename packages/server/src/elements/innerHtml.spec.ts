import {
  describe,
  it,
  expect
} from 'vitest'
import { signal } from 'kida'
import {
  div,
  img,
  pre
} from './elements.js'
import { renderToString } from '../renderToString.js'
import { dangerouslySetInnerHtml } from './innerHtml.js'

describe('server', () => {
  describe('elements', () => {
    describe('dangerouslySetInnerHtml', () => {
      it('should write the HTML as the content', () => {
        expect(renderToString(() => dangerouslySetInnerHtml(
          div({
            class: 'markdown',
            title: 'a > b'
          }),
          '<p>Some <b>text</b></p>'
        ))).toBe('<div class="markdown" title="a &gt; b"><p>Some <b>text</b></p></div>')
      })

      it('should replace the children of the element', () => {
        expect(renderToString(() => dangerouslySetInnerHtml(
          div()(
            'child'
          ),
          '<i>html</i>'
        ))).toBe('<div><i>html</i></div>')
      })

      it('should keep a leading newline of the HTML in a pre', () => {
        expect(renderToString(() => dangerouslySetInnerHtml(
          pre(),
          '\nline'
        ))).toBe('<pre>\n\nline</pre>')
      })

      it('should leave a void element as it is', () => {
        expect(renderToString(() => dangerouslySetInnerHtml(
          img({
            src: 'a.png'
          }),
          '<b>html</b>'
        ))).toBe('<img src="a.png">')
      })

      it('should write the current HTML of a signal', () => {
        const $html = signal('<hr>')

        expect(renderToString(() => dangerouslySetInnerHtml(
          div(),
          $html
        ))).toBe('<div><hr></div>')
      })
    })
  })
})
