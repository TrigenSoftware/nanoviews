import {
  describe,
  it,
  expect
} from 'vitest'
import { signal } from 'kida'
import {
  a,
  audio,
  br,
  button,
  code,
  div,
  img,
  input,
  pre,
  script,
  source,
  span,
  style,
  title,
  video,
  createElement,
  createVoidElement,
  createElementFactory,
  createVoidElementFactory,
  classList
} from '../index.js'
import { renderToString } from '../renderToString.js'
import { fragment } from './fragment.js'

describe('server', () => {
  describe('elements', () => {
    describe('elements', () => {
      it('should write a void element without content and end tag', () => {
        expect(renderToString(() => fragment(
          br(),
          img({
            src: 'a.png',
            alt: ''
          })
        ))).toBe('<br><img src="a.png" alt="">')
      })

      it('should decide the end tag by the tag name', () => {
        expect(renderToString(() => fragment(
          createVoidElement('div', {
            id: 'a'
          }),
          createElement('br')(
            'dropped'
          )
        ))).toBe('<div id="a"></div><br>')
      })

      it('should write the text elements described by their tag names', () => {
        const preFactory = createElementFactory('pre')

        expect(renderToString(() => fragment(
          createElement('script')(
            'if (a < b && c) go()'
          ),
          createElement('style')(
            'a > b {}'
          ),
          preFactory()(
            '\nline'
          )
        ))).toBe('<script>if (a < b && c) go()</script><style>a > b {}</style><pre>\n\nline</pre>')
      })

      it('should write names that objects inherit as names', () => {
        expect(renderToString(() => div({
          constructor: 'x'
        } as Parameters<typeof div>[0])())).toBe('<div constructor="x"></div>')
      })

      it('should create element factories', () => {
        const article = createElementFactory('article')
        const hr = createVoidElementFactory('hr')

        expect(renderToString(() => article()(
          hr()
        ))).toBe('<article><hr></article>')
      })

      it('should leave the empty attributes out', () => {
        expect(renderToString(() => button({
          disabled: true,
          hidden: false,
          'aria-hidden': false,
          'data-x': false,
          draggable: false,
          title: null,
          id: undefined,
          tabIndex: 0
        }))).toBe('<button disabled aria-hidden="false" data-x="false" draggable="false" tabindex="0"></button>')
      })

      it('should write the names the way the DOM has them', () => {
        expect(renderToString(() => div({
          accessKey: 'k',
          contentEditable: false,
          spellCheck: true
        }))).toBe('<div accesskey="k" contenteditable="false" spellcheck="true"></div>')
      })

      it('should write a boolean attribute that is on bare', () => {
        expect(renderToString(() => div({
          hidden: true,
          inert: signal(true),
          draggable: true,
          'aria-hidden': true
        }))).toBe('<div hidden inert draggable="true" aria-hidden="true"></div>')
      })

      it('should write the current value of an accessor attribute', () => {
        expect(renderToString(() => a({
          href: signal('/home'),
          title: () => 'Home'
        }))).toBe('<a href="/home" title="Home"></a>')
      })

      it('should escape attribute values', () => {
        expect(renderToString(() => div({
          title: 'a < b & "c" > d'
        }))).toBe('<div title="a &lt; b &amp; &quot;c&quot; &gt; d"></div>')
      })

      it('should throw for a name the DOM refuses', () => {
        expect(() => renderToString(() => div({
          'data-x onclick': 'alert(1)'
        }))).toThrow('Invalid attribute name: data-x onclick')
      })

      it('should leave event handlers and refs out', () => {
        const $ref = signal<Element | null>(null)

        expect(renderToString(() => button({
          ref: $ref,
          onClick() {
            throw new Error('Not called')
          }
        }))).toBe('<button></button>')
        expect($ref()).toBe(null)
      })

      it('should write autofocus for autoFocus', () => {
        expect(renderToString(() => fragment(
          input({
            autoFocus: true
          }),
          input({
            autoFocus: signal(false)
          })
        ))).toBe('<input autofocus><input>')
      })

      it('should write a style object', () => {
        expect(renderToString(() => div({
          style: {
            color: 'red',
            backgroundColor: 'blue',
            WebkitLineClamp: 2,
            '--gap': 4,
            width: undefined,
            margin: ''
          }
        }))).toBe('<div style="color:red;background-color:blue;-webkit-line-clamp:2;--gap:4"></div>')
      })

      it('should write the current value of a style accessor', () => {
        const $color = signal('red')

        expect(renderToString(() => div({
          style: () => ({
            color: $color()
          })
        }))).toBe('<div style="color:red"></div>')
      })

      it('should leave an empty style out', () => {
        expect(renderToString(() => fragment(
          div({
            style: {}
          }),
          div({
            style: null
          })
        ))).toBe('<div></div><div></div>')
      })

      it('should join a class list', () => {
        const $active = signal(true)

        expect(renderToString(() => div({
          class: ['card', false, ['card_wide', null], () => $active() && 'card_active', '']
        }))).toBe('<div class="card card_wide card_active"></div>')
      })

      it('should write an empty class for an empty list', () => {
        expect(renderToString(() => div({
          class: []
        }))).toBe('<div class=""></div>')
      })

      it('should take a class list accessor', () => {
        const $primary = signal(true)

        expect(renderToString(() => div({
          class: classList('button', () => $primary() && 'button_primary')
        }))).toBe('<div class="button button_primary"></div>')
      })

      it('should escape title text', () => {
        expect(renderToString(() => title()(
          'a < b'
        ))).toBe('<title>a &lt; b</title>')
      })

      it('should render a fragment', () => {
        expect(renderToString(() => fragment(
          span()(
            'a'
          ),
          'b'
        ))).toBe('<span>a</span>b')
      })

      describe('script', () => {
        it('should write the code as it is', () => {
          expect(renderToString(() => script()(
            'if (a < b && c > d) go("a & b")'
          ))).toBe('<script>if (a < b && c > d) go("a & b")</script>')
        })

        it('should escape a sequence that would end the script across children', () => {
          expect(renderToString(() => script()(
            '"</scr',
            'ipt><img src=x>"'
          ))).toBe('<script>"</\\u0073cript><img src=x>"</script>')
        })

        it('should escape the sequences that would end the script', () => {
          const $data = signal('{"text":"</script><SCRIPT>alert(1)</ScRiPt>"}')

          expect(renderToString(() => script({
            type: 'application/json'
          })(
            $data
          ))).toBe('<script type="application/json">{"text":"</\\u0073cript><\\u0053CRIPT>alert(1)</\\u0053cRiPt>"}</script>')
        })
      })

      describe('style', () => {
        it('should write the style as it is', () => {
          expect(renderToString(() => style()(
            'a > b { content: "&" }'
          ))).toBe('<style>a > b { content: "&" }</style>')
        })

        it('should escape the sequences that would end the style', () => {
          expect(renderToString(() => style()(
            'a { content: "</style>" } b { content: "<STYLE" }'
          ))).toBe('<style>a { content: "</\\73 tyle>" } b { content: "<\\53 TYLE" }</style>')
        })

        it('should escape the text after it', () => {
          expect(renderToString(() => code()(
            style()(
              'a {}'
            ),
            '<b>'
          ))).toBe('<code><style>a {}</style>&lt;b></code>')
        })
      })

      describe('pre', () => {
        it('should keep a leading newline of the content', () => {
          expect(renderToString(() => pre()(
            '\nline'
          ))).toBe('<pre>\n\nline</pre>')
        })

        it('should write an empty pre', () => {
          expect(renderToString(() => pre())).toBe('<pre>\n</pre>')
        })

        it('should write elements in it', () => {
          expect(renderToString(() => pre()(
            code()(
              'a < b'
            )
          ))).toBe('<pre>\n<code>a &lt; b</code></pre>')
        })
      })

      describe('audio', () => {
        it('should write muted of a signal as an attribute', () => {
          expect(renderToString(() => audio({
            muted: signal(true)
          })(
            source({
              src: 'a.mp3'
            })
          ))).toBe('<audio muted><source src="a.mp3"></audio>')
        })
      })

      describe('video', () => {
        it('should write muted as an attribute', () => {
          expect(renderToString(() => video({
            muted: true,
            autoPlay: true
          }))).toBe('<video muted autoplay></video>')
        })

        it('should leave muted out for a video that is not muted', () => {
          expect(renderToString(() => video({
            muted: () => false,
            src: 'a.mp4'
          }))).toBe('<video src="a.mp4"></video>')
        })
      })
    })
  })
})
