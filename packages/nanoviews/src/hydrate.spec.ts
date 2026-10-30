import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  signal,
  inject,
  provide
} from 'kida'
import {
  b,
  br,
  button,
  div,
  i,
  li,
  p,
  ul
} from './elements/elements.js'
import { fragment } from './elements/fragment.js'
import { portal } from './elements/portal.js'
import { if_ } from './flow/if.js'
import { for_ } from './flow/for.js'
import { show_ } from './flow/show.js'
import {
  case_,
  default_
} from './flow/switch.js'
import { show_switch_ } from './flow/showSwitch.js'
import { when_ } from './flow/match.js'
import { show_match_ } from './flow/showMatch.js'
import { browser_ } from './flow/browser.js'
import { component$ } from './component/component.js'
import { context$ } from './component/context.js'
import { hydrate } from './hydrate.js'

function markup(html: string) {
  const target = document.createElement('div')

  target.innerHTML = html

  return target
}

function Theme$() {
  return signal('light')
}

describe('nanoviews', () => {
  describe('hydrate', () => {
    it('should take the elements of the markup instead of making them', () => {
      const target = markup('<div id="app"><p class="text">a</p><br></div>')
      const app = target.firstChild
      const text = target.querySelector('p')

      hydrate(() => div({
        id: 'app'
      })(
        p({
          class: 'text'
        })(
          'a'
        ),
        br()
      ), target)

      expect(target.firstChild).toBe(app)
      expect(target.querySelector('p')).toBe(text)
      expect(target.innerHTML).toBe('<div id="app"><p class="text">a</p><br></div>')
    })

    it('should take an element described without children', () => {
      const target = markup('<div></div><p>a</p>')
      const empty = target.firstChild

      hydrate(() => fragment(
        div(),
        p()(
          'a'
        )
      ), target)

      expect(target.firstChild).toBe(empty)
      expect(target.innerHTML).toBe('<div></div><p>a</p>')
    })

    it('should cut the texts the markup joined', () => {
      const $name = signal('Ann')
      const target = markup('<p>Hello, Ann!</p>')

      hydrate(() => p()(
        'Hello, ', $name, '!'
      ), target)

      expect(target.firstChild!.childNodes).toHaveLength(3)

      $name('Bob')

      expect(target.innerHTML).toBe('<p>Hello, Bob!</p>')
    })

    it('should make an empty text in place', () => {
      const $text = signal('')
      const target = markup('<p>a</p>')

      hydrate(() => p()(
        $text, 'a'
      ), target)

      $text('b')

      expect(target.innerHTML).toBe('<p>ba</p>')
    })

    it('should attach the handlers', () => {
      const onClick = vi.fn()
      const target = markup('<button>Go</button>')

      hydrate(() => button({
        onClick
      })(
        'Go'
      ), target)
      ;(target.firstChild as HTMLButtonElement).click()

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should take a block of a reactive value from its markers', () => {
      const $shown = signal(true)
      const target = markup('<div><!--[--><b>yes</b><!--]--></div>')
      const yes = target.querySelector('b')

      hydrate(() => div()(
        if_($shown)(
          () => b()(
            'yes'
          ),
          () => 'no'
        )
      ), target)

      expect(target.querySelector('b')).toBe(yes)

      $shown(false)

      expect(target.innerHTML).toBe('<div><!--[-->no<!--]--></div>')
    })

    it('should take the blocks in a block', () => {
      const $outer = signal(true)
      const $inner = signal(true)
      const target = markup('<!--[--><!--[--><b>inner</b><!--]-->outer<!--]-->')
      const inner = target.querySelector('b')

      hydrate(() => if_($outer)(
        () => fragment(
          if_($inner)(
            () => b()(
              'inner'
            )
          ),
          'outer'
        )
      ), target)

      expect(target.querySelector('b')).toBe(inner)

      $inner(false)

      expect(target.innerHTML).toBe('<!--[--><!--[--><!--]-->outer<!--]-->')
    })

    it('should take the items of a reactive list', () => {
      const $items = signal(['a', 'b'])
      const target = markup('<ul><!--[--><li>a</li><li>b</li><!--]--></ul>')
      const [a, b] = target.querySelectorAll('li')

      hydrate(() => ul()(
        for_($items, item => item)(
          $item => li()(
            $item
          )
        )
      ), target)

      $items(['b', 'a', 'c'])

      const items = target.querySelectorAll('li')

      expect(items[0]).toBe(b)
      expect(items[1]).toBe(a)
      expect(target.innerHTML).toBe('<ul><!--[--><li>b</li><li>a</li><li>c</li><!--]--></ul>')
    })

    it('should give a place to an item that renders nothing', () => {
      const $items = signal([1, 0, 2])
      const target = markup('<!--[--><b>1</b><b>2</b><!--]-->')

      hydrate(() => for_($items)(
        $item => ($item()
          ? b()(
            $item
          )
          : null)
      ), target)

      $items([2, 0, 1])

      expect(target.innerHTML).toBe('<!--[--><b>2</b><b>1</b><!--]-->')
    })

    it('should take the items of several nodes', () => {
      const $items = signal(['a', 'b'])
      const target = markup('<!--[--><b>a</b>.<b>b</b>.<!--]-->')

      hydrate(() => for_($items)(
        $item => fragment(
          b()(
            $item
          ),
          '.'
        )
      ), target)

      $items(['b'])

      expect(target.innerHTML).toBe('<!--[--><b>b</b>.<!--]-->')
    })

    it('should build the hidden content of a show_ fresh', () => {
      const $shown = signal(false)
      const target = markup('<!--[--><!--]-->')

      hydrate(() => show_($shown, () => b()(
        'shown'
      )), target)

      expect(target.innerHTML).toBe('<!--[--><!--]-->')

      $shown(true)

      expect(target.innerHTML).toBe('<!--[--><b>shown</b><!--]-->')
    })

    it('should take the blocks of the cases of a show_switch_ one after another', () => {
      const $tab = signal('b')
      const target = markup('<!--[--><!--]--><!--[--><b>B</b><!--]--><!--[--><!--]--><p>after</p>')
      const shown = target.querySelector('b')
      const after = target.querySelector('p')

      hydrate(() => fragment(
        show_switch_($tab)(
          case_('a', () => b()(
            'A'
          )),
          case_('b', () => b()(
            'B'
          )),
          default_(() => 'None')
        ),
        p()(
          'after'
        )
      ), target)

      expect(target.querySelector('b')).toBe(shown)
      expect(target.querySelector('p')).toBe(after)

      $tab('a')

      expect(target.innerHTML).toBe('<!--[--><b>A</b><!--]--><!--[--><!--]--><!--[--><!--]--><p>after</p>')
    })

    it('should take the blocks of the cases of a show_match_ one after another', () => {
      const $open = signal(false)
      const target = markup('<!--[--><!--]--><!--[-->closed<!--]-->')

      hydrate(() => show_match_(
        when_($open, () => b()(
          'open'
        )),
        default_(() => 'closed')
      ), target)

      $open(true)

      expect(target.innerHTML).toBe('<!--[--><b>open</b><!--]--><!--[--><!--]-->')
    })

    it('should build the content of a portal fresh', () => {
      const host = document.createElement('div')
      const target = markup('<p>page</p>')

      hydrate(() => fragment(
        p()(
          'page'
        ),
        portal(() => host, b()(
          'portal'
        ))
      ), target)

      expect(host.innerHTML).toBe('<b>portal</b>')
      expect(target.innerHTML).toBe('<p>page</p>')
    })

    it('should build the child of browser_ fresh in place of the fallback', () => {
      const target = markup('<div><!--[--><i>loading</i><!--]--><p>after</p></div>')
      const after = target.querySelector('p')

      hydrate(() => div()(
        browser_(
          () => b()(
            'chart'
          ),
          () => i()(
            'loading'
          )
        ),
        p()(
          'after'
        )
      ), target)

      expect(target.innerHTML).toBe('<div><!--[--><b>chart</b><!--]--><p>after</p></div>')
      expect(target.querySelector('p')).toBe(after)
    })

    it('should take the child of an injection context in its place', () => {
      const Theme = component$(() => p()(
        inject(Theme$)
      ))
      const target = markup('<p>dark</p>')
      const theme = target.firstChild

      hydrate(() => context$(provide(Theme$, signal('dark')))(
        Theme()
      ), target)

      expect(target.firstChild).toBe(theme)
      expect(target.innerHTML).toBe('<p>dark</p>')
    })

    it('should build the children of an element the markup left empty', () => {
      const target = markup('<div></div>')

      hydrate(() => div()(
        b()(
          'built'
        )
      ), target)

      expect(target.innerHTML).toBe('<div><b>built</b></div>')
    })

    it('should throw for markup that does not match', () => {
      expect(() => hydrate(() => div(), markup('<p></p>'))).toThrow('The markup to hydrate does not match the view')
      expect(() => hydrate(() => p()(
        'a'
      ), markup('<p><b></b></p>'))).toThrow('The markup to hydrate does not match the view')
      expect(() => hydrate(() => if_(signal(true))(
        () => 'a'
      ), markup('a'))).toThrow('The markup to hydrate does not match the view')
    })

    it('should remove the nodes on unmount', () => {
      const target = markup('<p>a</p>b')
      const unmount = hydrate(() => fragment(
        p()(
          'a'
        ),
        'b'
      ), target)

      unmount()

      expect(target.innerHTML).toBe('')
    })

    it('should leave the nodes after the app on unmount', () => {
      const target = markup('<p>app</p><i>page</i>')
      const unmount = hydrate(() => p()(
        'app'
      ), target)

      unmount()

      expect(target.innerHTML).toBe('<i>page</i>')
    })

    it('should unmount an app that renders nothing', () => {
      const target = markup('')
      const unmount = hydrate(() => null, target)

      expect(unmount).not.toThrow()
    })
  })
})
