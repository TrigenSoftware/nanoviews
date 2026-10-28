// @vitest-environment happy-dom
import {
  describe,
  it,
  expect
} from 'vitest'
import {
  inject,
  provide,
  signal
} from 'kida'
import * as client from 'nanoviews'
import * as clientStore from 'nanoviews/store'
import * as clientSvg from 'nanoviews/svg'
import * as server from './index.js'
import * as serverStore from './store.js'
import * as serverSvg from './svg/index.js'

type View = (html: typeof client, svg: typeof clientSvg) => client.Child

function Theme$() {
  return signal('light')
}

const booleanAttributes = /^(?:allowfullscreen|async|autoplay|capture|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected|shadowroot(?:clonable|customelementregistry|delegatesfocus|serializable))$/

// What the page shows, whichever way it was built: attributes in order of
// name, a boolean one by its presence, which the client writes as `"true"`
// and the markup bare, the style the element got, adjacent text joined and
// empty text left out, and the state of the controls, which the client keeps
// in properties and the markup in attributes
function snapshot(node: Node): unknown {
  if (node.nodeType === 3) {
    return (node as Text).data
  }

  const element = node as HTMLElement & Partial<HTMLInputElement & HTMLOptionElement & HTMLMediaElement>
  const isControl = /^(?:input|option|select|video|audio)$/.test(element.localName)
  const children: unknown[] = []
  let text = ''

  for (const child of element.childNodes) {
    const value = snapshot(child)

    if (typeof value === 'string') {
      text += value
    } else {
      if (text) {
        children.push(text)
      }

      text = ''
      children.push(value)
    }
  }

  if (text) {
    children.push(text)
  }

  return {
    tag: element.localName,
    attributes: element.getAttributeNames()
      .filter(name => name !== 'style' && !(isControl && /^(?:value|checked|selected|muted)$/.test(name)))
      .sort()
      .map(name => [name, booleanAttributes.test(name) || element.getAttribute(name)]),
    style: element.style?.cssText,
    state: isControl
      ? [element.value, element.checked, element.selected, element.muted]
      : undefined,
    children
  }
}

async function compare(view: View) {
  const clientContainer = document.createElement('div')
  const serverContainer = document.createElement('div')

  document.body.append(clientContainer)

  const unmount = client.mount(() => view(client, clientSvg), clientContainer)

  // A select applies a static value once its options are in, a microtask later
  await new Promise(resolve => setTimeout(resolve))

  serverContainer.innerHTML = server.renderToString(() => view(server as unknown as typeof client, serverSvg))

  expect(snapshot(serverContainer)).toEqual(snapshot(clientContainer))

  unmount()
  clientContainer.remove()
}

describe('server', () => {
  it('should export the names nanoviews exports', () => {
    expect(Object.keys(server).sort()).toEqual(Object.keys(client).sort())
  })

  it('should export the names nanoviews/store exports', () => {
    expect(Object.keys(serverStore).sort()).toEqual(Object.keys(clientStore).sort())
  })

  it('should export the names nanoviews/svg exports', () => {
    expect(Object.keys(serverSvg).sort()).toEqual(Object.keys(clientSvg).sort())
  })

  describe('render', () => {
    it('should write the attributes the client sets', async () => {
      await compare(({ div, a }) => div({
        id: 'a',
        title: 'x < "y" & z > w',
        hidden: true,
        lang: '',
        dir: undefined,
        'aria-hidden': false,
        'data-count': 0,
        draggable: false,
        tabIndex: -1,
        accessKey: 'k',
        contentEditable: false,
        spellCheck: true
      })(
        a({
          href: signal('/home'),
          title: () => null,
          rel: () => 'noopener'
        })(
          'Home'
        )
      ))
    })

    it('should write the class lists the client joins', async () => {
      const $active = signal(true)

      await compare(({ div, span }) => div({
        class: ['card', false, ['card_wide', null, () => 'card_dark'], () => $active() && 'card_active', '']
      })(
        span({
          class: []
        }),
        span({
          class: 'plain'
        })
      ))
    })

    it('should write the styles the client sets', async () => {
      const $color = signal('blue')

      await compare(({ div }) => div({
        style: {
          color: 'red',
          backgroundColor: 'green',
          marginTop: 0,
          '--gap': '4px',
          width: undefined
        }
      })(
        div({
          style: () => ({
            color: $color()
          })
        })
      ))
    })

    it('should write the text the client builds', async () => {
      const $count = signal(5)

      await compare(({ p, style }) => p()(
        'a < b & c > "d"',
        0,
        null,
        true,
        false,
        '',
        () => 'x',
        $count,
        style()(
          'a > b { color: red }'
        )
      ))
    })

    it('should write the components, fragments and contexts the client builds', async () => {
      await compare(({ component$, context$, fragment, section, h2, p }) => {
        const Theme = component$(() => {
          const $theme = inject(Theme$)

          return p()(
            $theme
          )
        })
        const Card = component$(({ title }: { title: string }, children) => section()(
          h2()(
            title
          ),
          fragment(...children)
        ))

        return context$(provide(Theme$, signal('dark')))(
          Card({
            title: 'Title'
          })(
            Theme(),
            'text'
          )
        )
      })
    })

    it('should write the blocks the client builds', async () => {
      const $items = signal([
        {
          id: 1,
          name: 'one'
        },
        {
          id: 2,
          name: 'two'
        }
      ])

      await compare(({ div, ul, li, p, if_, switch_, case_, default_, match_, when_, show_, for_, trackById }) => div()(
        if_(signal(true))(
          () => p()(
            'then'
          ),
          () => p()(
            'else'
          )
        ),
        switch_(signal('b'))(
          case_('a', () => 'A'),
          case_('b', () => 'B'),
          default_(() => 'none')
        ),
        match_(
          when_(signal(false), () => 'first'),
          default_(() => 'fallback')
        ),
        show_(signal(false), () => p()(
          'hidden'
        )),
        show_(signal(true), () => p()(
          'shown'
        )),
        ul()(
          for_($items, trackById)(
            ($item, $index) => li()(
              $index, ': ', () => $item().name
            )
          )
        ),
        for_(signal<string[]>([]))(
          $item => $item,
          () => 'empty'
        )
      ))
    })

    it('should write the controls the client sets', async () => {
      await compare(({ div, input, select, option, optgroup, Indeterminate }) => div()(
        input({
          value: signal('live'),
          defaultValue: 'default'
        }),
        input({
          defaultValue: 'default'
        }),
        input({
          type: 'checkbox',
          checked: signal(true)
        }),
        input({
          type: 'checkbox',
          checked: false,
          defaultChecked: true
        }),
        input({
          type: 'checkbox',
          checked: Indeterminate,
          defaultChecked: true
        }),
        select({
          value: 'b'
        })(
          option({
            value: 'a'
          })(
            'A'
          ),
          option({
            value: 'b'
          })(
            'B'
          )
        ),
        select({
          value: 'green apple'
        })(
          option()(
            'red apple'
          ),
          // happy-dom gives the text of an option as its value without the
          // white space collapsed, so only a text with none to collapse is
          // compared here
          option()(
            'green apple'
          )
        ),
        select({
          value: signal<string | null>(null),
          defaultValue: 'b'
        })(
          option({
            value: 'a'
          }),
          option({
            value: 'b'
          })
        ),
        select({
          multiple: true,
          value: ['a', 'c']
        })(
          optgroup({
            label: 'Letters'
          })(
            option({
              value: 'a'
            }),
            option({
              value: 'b'
            }),
            option({
              value: 'c'
            })
          )
        )
      ))
    })

    it('should write the media state the client sets', async () => {
      await compare(({ video }) => video({
        muted: true,
        controls: true
      }))
    })

    it('should write the inner HTML the client sets', async () => {
      await compare(({ div, dangerouslySetInnerHtml }) => dangerouslySetInnerHtml(
        div({
          class: 'markdown'
        }),
        '<p>Some <b>text</b></p>'
      ))
    })

    it('should write nothing in place of a portal', async () => {
      await compare(({ div, span, portal }) => div()(
        'before',
        portal(() => document.body, span()(
          'portal'
        )),
        'after'
      ))
    })

    it('should write the SVG the client builds', async () => {
      await compare((_, { svg, path, linearGradient, stop, text }) => svg({
        viewBox: '0 0 24 24',
        width: 24
      })(
        path({
          d: 'M0 0',
          strokeWidth: 2,
          strokeLinecap: 'round',
          fillOpacity: 0.5,
          clipPath: 'url(#c)',
          class: ['icon', null]
        }),
        linearGradient({
          gradientUnits: 'userSpaceOnUse'
        })(
          stop({
            offset: 0,
            stopColor: 'red'
          })
        ),
        text({
          textAnchor: 'middle',
          tabIndex: 0
        })(
          'Label'
        )
      ))
    })
  })
})
