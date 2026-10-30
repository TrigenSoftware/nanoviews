import {
  vi,
  describe,
  it,
  expect
} from 'vitest'
import {
  record,
  signal,
  inject,
  provide
} from 'kida'
import {
  li,
  p,
  ul
} from './elements/elements.js'
import { renderToString } from './renderToString.js'
import { context$ } from './component.js'
import {
  trackById,
  as_,
  browser_,
  case_,
  default_,
  for_,
  if_,
  match_,
  show_,
  show_match_,
  show_switch_,
  swap_,
  switch_,
  when_
} from './flow.js'

function Theme$() {
  return signal('light')
}

describe('server', () => {
  describe('flow', () => {
    describe('if_', () => {
      it('should render the branch of the current value', () => {
        const $user = signal<string | null>('Ann')

        expect(renderToString(() => if_($user)(
          $name => p()(
            $name
          ),
          () => 'Guest'
        ))).toBe('<!--[--><p>Ann</p><!--]-->')

        $user(null)

        expect(renderToString(() => if_($user)(
          $name => p()(
            $name
          ),
          () => 'Guest'
        ))).toBe('<!--[-->Guest<!--]-->')
      })

      it('should decide a static value', () => {
        expect(renderToString(() => if_(false)(
          () => 'yes',
          () => 'no'
        ))).toBe('no')
      })

      it('should build the child of a static value within the context it is placed in', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          if_(true)(
            () => p()(
              inject(Theme$)
            )
          )
        ))).toBe('<p>dark</p>')
      })
    })

    describe('swap_', () => {
      it('should render the child of the current value', () => {
        expect(renderToString(() => swap_(signal(2), count => p()(
          String(count * 2)
        )))).toBe('<!--[--><p>4</p><!--]-->')
      })

      it('should build the child of a static value within the context it is placed in', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          swap_('a', () => p()(
            inject(Theme$)
          ))
        ))).toBe('<p>dark</p>')
      })
    })

    describe('switch_', () => {
      it('should render the case of the value', () => {
        expect(renderToString(() => switch_(signal('b'))(
          case_('a', () => 'A'),
          case_('b', () => 'B'),
          default_(() => 'None')
        ))).toBe('<!--[-->B<!--]-->')
      })

      it('should take the last of repeated cases and defaults', () => {
        expect(renderToString(() => switch_(signal('a'))(
          case_('a', () => 'first'),
          case_('a', () => 'last')
        ))).toBe('<!--[-->last<!--]-->')
        expect(renderToString(() => switch_('x')(
          default_(() => 'first'),
          case_('a', () => 'A'),
          default_(() => 'last')
        ))).toBe('last')
      })

      it('should render the default without a case', () => {
        expect(renderToString(() => switch_('c')(
          case_('a', () => 'A'),
          default_(() => 'None')
        ))).toBe('None')
      })

      it('should build the case of a static value within the context it is placed in', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          switch_('a')(
            case_('a', () => p()(
              inject(Theme$)
            ))
          )
        ))).toBe('<p>dark</p>')
      })
    })

    describe('show_switch_', () => {
      it('should render the shown case only', () => {
        expect(renderToString(() => show_switch_(signal('b'))(
          case_('a', () => 'A'),
          case_('b', () => 'B')
        ))).toBe('<!--[--><!--]--><!--[-->B<!--]-->')
      })

      it('should show the default when no case matches', () => {
        expect(renderToString(() => show_switch_(signal('c'))(
          case_('a', () => 'A'),
          default_(() => 'None')
        ))).toBe('<!--[--><!--]--><!--[-->None<!--]-->')
      })

      it('should show nothing when no case matches and there is no default', () => {
        expect(renderToString(() => show_switch_(signal('c'))(
          case_('a', () => 'A')
        ))).toBe('<!--[--><!--]-->')
      })

      it('should keep one block for a repeated key, in the place of its first case with the child of its last', () => {
        expect(renderToString(() => show_switch_(signal('a'))(
          case_('a', () => 'first'),
          case_('b', () => 'B'),
          case_('a', () => 'last')
        ))).toBe('<!--[-->last<!--]--><!--[--><!--]-->')
      })

      it('should build the case of a static value within the context it is placed in', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          show_switch_('a')(
            case_('a', () => p()(
              inject(Theme$)
            ))
          )
        ))).toBe('<p>dark</p>')
      })
    })

    describe('match_', () => {
      it('should render the first case that holds', () => {
        let reads = 0
        const $last = () => {
          reads++

          return true
        }

        expect(renderToString(() => match_(
          when_(signal(false), () => 'first'),
          when_(signal('second'), $value => $value),
          when_($last, () => 'last'),
          default_(() => 'none')
        ))).toBe('<!--[-->second<!--]-->')
        expect(reads).toBe(0)
      })

      it('should render the default when no case holds', () => {
        expect(renderToString(() => match_(
          when_(signal(0), () => 'zero'),
          default_(() => 'none')
        ))).toBe('<!--[-->none<!--]-->')
      })

      it('should write an empty block when no case holds and there is no default', () => {
        expect(renderToString(() => match_(
          when_(signal(false), () => 'first')
        ))).toBe('<!--[--><!--]-->')
      })

      it('should build the child of a static case within the context it is placed in', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          match_(
            when_(true, () => p()(
              inject(Theme$)
            ))
          )
        ))).toBe('<!--[--><p>dark</p><!--]-->')
      })
    })

    describe('show_match_', () => {
      it('should render the shown case only', () => {
        expect(renderToString(() => show_match_(
          when_(signal(false), () => 'first'),
          when_(signal(true), () => 'second')
        ))).toBe('<!--[--><!--]--><!--[-->second<!--]-->')
      })

      it('should build the child of a static case within the context it is placed in', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          show_match_(
            when_(true, () => p()(
              inject(Theme$)
            ))
          )
        ))).toBe('<!--[--><p>dark</p><!--]-->')
      })
    })

    describe('show_', () => {
      it('should render the child while the value is truthy', () => {
        let renders = 0
        const render = () => {
          renders++

          return 'shown'
        }

        expect(renderToString(() => show_(signal(true), render))).toBe('<!--[-->shown<!--]-->')
        expect(renderToString(() => show_(signal(false), render))).toBe('<!--[--><!--]-->')
        expect(renderToString(() => show_(false, render))).toBe('')
        expect(renders).toBe(1)
      })

      it('should build the child of a static value within the context it is placed in', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          show_(true, () => p()(
            inject(Theme$)
          ))
        ))).toBe('<p>dark</p>')
      })
    })

    describe('for_', () => {
      it('should render every item', () => {
        const $todos = signal([
          {
            id: 1,
            title: 'Write'
          },
          {
            id: 2,
            title: 'Ship'
          }
        ])

        expect(renderToString(() => ul()(
          for_($todos, trackById)(
            ($todo, $index, id) => li({
              id: `todo-${id}`
            })(
              $index, ': ', () => $todo().title
            )
          )
        ))).toBe('<ul><!--[--><li id="todo-1">0: Write</li><li id="todo-2">1: Ship</li><!--]--></ul>')
      })

      it('should hand a record of every item to the render function', () => {
        const $todos = signal([
          {
            id: 1,
            title: 'Write'
          }
        ])

        expect(renderToString(() => ul()(
          for_($todos, trackById)(
            as_(record, $todo => li()(
              $todo.$title
            ))
          )
        ))).toBe('<ul><!--[--><li>Write</li><!--]--></ul>')
      })

      it('should render else for an empty or missing list', () => {
        expect(renderToString(() => for_(signal<string[]>([]))(
          $item => $item,
          () => 'Empty'
        ))).toBe('<!--[-->Empty<!--]-->')
        expect(renderToString(() => for_(signal<string[] | null>(null))(
          $item => $item,
          () => 'None'
        ))).toBe('<!--[-->None<!--]-->')
      })

      it('should render else for an empty static array', () => {
        expect(renderToString(() => for_([])(
          item => String(item),
          () => 'Empty'
        ))).toBe('Empty')
      })

      it('should render a static array once', () => {
        expect(renderToString(() => ul()(
          for_(['a', 'b'])(
            (item, index) => li()(
              item, String(index)
            )
          )
        ))).toBe('<ul><li>a0</li><li>b1</li></ul>')
      })

      it('should build the items of a static array within the context they are placed in', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          for_(['a'])(
            () => p()(
              inject(Theme$)
            )
          )
        ))).toBe('<p>dark</p>')
      })

      it('should build the placeholder of an empty static array within the context it is placed in', () => {
        expect(renderToString(() => context$(provide(Theme$, signal('dark')))(
          for_([])(
            () => p()(
              'item'
            ),
            () => p()(
              inject(Theme$)
            )
          )
        ))).toBe('<p>dark</p>')
      })
    })

    describe('browser_', () => {
      it('should write the fallback in a block without calling render', () => {
        const render = vi.fn(() => 'chart')

        expect(renderToString(() => browser_(render, () => p()(
          'loading'
        )))).toBe('<!--[--><p>loading</p><!--]-->')
        expect(render).not.toHaveBeenCalled()
      })

      it('should write an empty block without a fallback', () => {
        expect(renderToString(() => browser_(() => 'chart'))).toBe('<!--[--><!--]-->')
      })
    })
  })
})
