import {
  describe,
  it,
  expect
} from 'vitest'
import {
  computed,
  effect,
  mountable,
  onMount,
  signal
} from 'kida'
import {
  b,
  div,
  hr,
  li,
  ul,
  p,
  section,
  h2,
  select,
  option,
  script,
  fragment,
  component$,
  effect$,
  for_
} from './index.js'
import { renderToString } from './renderToString.js'

describe('server', () => {
  describe('renderToString', () => {
    it('should render elements, attributes and text', () => {
      expect(renderToString(() => div({
        id: 'app',
        class: 'root'
      })(
        'Hello, ',
        b()(
          'world'
        ),
        '!'
      ))).toBe('<div id="app" class="root">Hello, <b>world</b>!</div>')
    })

    it('should write the current value of an accessor child', () => {
      const $name = signal('Ann')

      expect(renderToString(() => p()(
        'Hi, ', $name, ' and ', () => $name().toUpperCase()
      ))).toBe('<p>Hi, Ann and ANN</p>')
    })

    it('should escape text', () => {
      expect(renderToString(() => p()(
        'a < b && c > "d"'
      ))).toBe('<p>a &lt; b &amp;&amp; c > "d"</p>')
    })

    it('should write nothing for empty and boolean children and keep 0', () => {
      expect(renderToString(() => p()(
        null, undefined, true, false, '', 0, () => null
      ))).toBe('<p>0</p>')
    })

    it('should render a component with props and children', () => {
      const Card = component$(({ title }: { title: string }, children) => section()(
        h2()(
          title
        ),
        ...children
      ))

      expect(renderToString(() => Card({
        title: 'Title'
      })(
        'Body'
      ))).toBe('<section><h2>Title</h2>Body</section>')
    })

    it('should render a component that returns text or an accessor', () => {
      const $count = signal(3)
      const Text = component$(() => 'text')
      const Count = component$(() => $count)

      expect(renderToString(() => p()(
        Text(), ' ', Count()
      ))).toBe('<p>text 3</p>')
    })

    it('should write a description in each of its places', () => {
      const divider = hr()

      expect(renderToString(() => ul()(
        for_(signal(['a', 'b', 'c']))(
          $item => fragment(
            li()(
              $item
            ),
            divider
          )
        )
      ))).toBe('<ul><!--[--><li>a</li><hr><li>b</li><hr><li>c</li><hr><!--]--></ul>')
    })

    it('should render inside a render', () => {
      const Snippet = component$(() => p({
        title: renderToString(() => b()(
          'inner'
        ))
      }))

      expect(renderToString(() => div()(
        'before',
        Snippet(),
        'after'
      ))).toBe('<div>before<p title="&lt;b&gt;inner&lt;/b&gt;"></p>after</div>')
    })

    it('should not carry a render whose cleanup threw over to the next one', () => {
      const App = component$(() => {
        effect(() => () => {
          throw new Error('Cleanup')
        })

        return p()(
          'private'
        )
      })

      expect(() => renderToString(() => App())).toThrow('Cleanup')
      expect(renderToString(() => p()(
        'public'
      ))).toBe('<p>public</p>')
    })

    it('should render a text app', () => {
      expect(renderToString(() => 'a < b')).toBe('a &lt; b')
    })

    it('should run no effect$', () => {
      let runs = 0
      const App = component$(() => {
        effect$(() => {
          runs++
        })

        return p()(
          'App'
        )
      })

      expect(renderToString(() => App())).toBe('<p>App</p>')
      expect(runs).toBe(0)
    })

    it('should stop the effects created while rendering', () => {
      const $count = signal(1)
      let runs = 0
      const App = component$(() => {
        effect(() => {
          $count()
          runs++
        })

        return p()(
          $count
        )
      })

      expect(renderToString(() => App())).toBe('<p>1</p>')

      $count(2)

      expect(runs).toBe(1)
    })

    it('should read the values a render sets up', () => {
      const $count = signal(2)
      const App = component$(() => {
        const $double = computed(() => $count() * 2)

        return p()(
          $double
        )
      })

      expect(renderToString(() => App())).toBe('<p>4</p>')
    })

    it('should not mount a store the render reads', () => {
      const $store = mountable(signal('value'))
      let mounts = 0

      onMount($store, () => {
        mounts++
      })

      expect(renderToString(() => p()(
        $store
      ))).toBe('<p>value</p>')
      expect(mounts).toBe(0)
    })

    it('should throw what the render throws', () => {
      expect(() => renderToString(() => {
        throw new Error('Failed')
      })).toThrow('Failed')
    })

    it('should let go of the stores a failed render read', () => {
      const $count = signal(1)
      const App = component$(() => {
        computed(() => $count() * 2)()

        throw new Error('Failed')
      })

      expect(() => renderToString(() => App())).toThrow('Failed')
      expect($count.node.subs).toBeUndefined()
    })

    it('should not carry a failed render over to the next one', () => {
      const Broken = component$(() => {
        throw new Error('Failed')
      })

      expect(() => renderToString(() => select({
        value: 'a'
      })(
        Broken()
      ))).toThrow('Failed')
      expect(() => renderToString(() => script()(
        Broken()
      ))).toThrow('Failed')
      expect(renderToString(() => div()(
        option({
          value: 'a'
        })(
          'A'
        ),
        '</script>'
      ))).toBe('<div><option value="a">A</option>&lt;/script></div>')
    })
  })
})
