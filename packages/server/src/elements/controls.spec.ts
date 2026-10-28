import {
  describe,
  it,
  expect
} from 'vitest'
import { signal } from 'kida'
import {
  Indeterminate,
  b,
  optgroup,
  for_
} from '../index.js'
import { renderToString } from '../renderToString.js'
import { fragment } from './fragment.js'
import {
  input,
  textarea,
  select,
  option
} from './controls.js'

describe('server', () => {
  describe('elements', () => {
    describe('controls', () => {
      describe('input', () => {
        it('should write the value', () => {
          expect(renderToString(() => input({
            name: 'q',
            value: signal('query')
          }))).toBe('<input name="q" value="query">')
        })

        it('should write the live value over the default', () => {
          expect(renderToString(() => fragment(
            input({
              value: 'live',
              defaultValue: 'default'
            }),
            input({
              defaultValue: 'default'
            })
          ))).toBe('<input value="live"><input value="default">')
        })

        it('should take an empty accessor as the live value', () => {
          expect(renderToString(() => input({
            value: () => '',
            defaultValue: 'default'
          }))).toBe('<input>')
        })

        it('should write checked for the live check over the default', () => {
          expect(renderToString(() => fragment(
            input({
              type: 'checkbox',
              checked: true
            }),
            input({
              type: 'checkbox',
              checked: signal(false),
              defaultChecked: true
            }),
            input({
              type: 'checkbox',
              defaultChecked: true
            })
          ))).toBe('<input type="checkbox" checked><input type="checkbox"><input type="checkbox" checked>')
        })

        it('should write the default check for the third state', () => {
          expect(renderToString(() => fragment(
            input({
              type: 'checkbox',
              checked: Indeterminate,
              defaultChecked: true
            }),
            input({
              type: 'checkbox',
              checked: signal<boolean | typeof Indeterminate>(Indeterminate)
            })
          ))).toBe('<input type="checkbox" checked><input type="checkbox">')
        })

        it('should write an input without attributes', () => {
          expect(renderToString(() => input())).toBe('<input>')
        })

        it('should escape the value', () => {
          expect(renderToString(() => input({
            value: 'a "b" < c'
          }))).toBe('<input value="a &quot;b&quot; &lt; c">')
        })
      })

      describe('textarea', () => {
        it('should write the value as content', () => {
          expect(renderToString(() => textarea({
            name: 'text',
            value: signal('a < b')
          }))).toBe('<textarea name="text">\na &lt; b</textarea>')
        })

        it('should write the default without a value', () => {
          expect(renderToString(() => textarea({
            defaultValue: 'default'
          }))).toBe('<textarea>\ndefault</textarea>')
        })

        it('should keep a leading newline of the content', () => {
          expect(renderToString(() => textarea({
            value: '\ntext'
          }))).toBe('<textarea>\n\ntext</textarea>')
        })

        it('should keep a leading carriage return of the content', () => {
          expect(renderToString(() => textarea({
            value: '\r\ntext'
          }))).toBe('<textarea>\n\r\ntext</textarea>')
        })

        it('should write an empty textarea', () => {
          expect(renderToString(() => fragment(
            textarea(),
            textarea({
              rows: 2
            }),
            textarea({
              value: () => undefined,
              defaultValue: 'default'
            })
          ))).toBe('<textarea></textarea><textarea rows="2">\n</textarea><textarea>\n</textarea>')
        })
      })

      describe('select', () => {
        it('should select the option of the value', () => {
          expect(renderToString(() => select({
            name: 'size',
            value: signal('m')
          })(
            option({
              value: 's'
            })(
              'S'
            ),
            option({
              value: 'm'
            })(
              'M'
            )
          ))).toBe('<select name="size"><option value="s">S</option><option value="m" selected>M</option></select>')
        })

        it('should select by the text of an option without a value', () => {
          expect(renderToString(() => select({
            value: 'green apple'
          })(
            option()(
              'red apple'
            ),
            option()(
              '  green\n  apple '
            )
          ))).toBe('<select><option>red apple</option><option selected>  green\n  apple </option></select>')
        })

        it('should compare the text of an option without its tags', () => {
          expect(renderToString(() => select({
            value: 'Bold'
          })(
            option()(
              'Plain'
            ),
            option()(
              b()(
                'Bold'
              )
            )
          ))).toBe('<select><option>Plain</option><option selected><b>Bold</b></option></select>')
        })

        it('should select nothing for an empty live value', () => {
          expect(renderToString(() => select({
            value: signal<string | null>(null),
            defaultValue: 'b'
          })(
            option({
              value: 'a'
            }),
            option({
              value: 'b'
            })
          ))).toBe('<select><option value="a"></option><option value="b"></option></select>')
        })

        it('should compare the text an option shows', () => {
          expect(renderToString(() => select({
            value: 'a & b < c'
          })(
            option()(
              'a & b < c'
            )
          ))).toBe('<select><option selected>a &amp; b &lt; c</option></select>')
        })

        it('should select every option of a list value', () => {
          expect(renderToString(() => select({
            multiple: true,
            value: ['a', 'c']
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
          ))).toBe('<select multiple><option value="a" selected></option><option value="b"></option><option value="c" selected></option></select>')
        })

        it('should select by the default without a value', () => {
          expect(renderToString(() => select({
            defaultValue: 'b'
          })(
            option({
              value: 'a'
            }),
            option({
              value: 'b'
            })
          ))).toBe('<select><option value="a"></option><option value="b" selected></option></select>')
        })

        it('should select options in groups and lists', () => {
          expect(renderToString(() => select({
            value: '2'
          })(
            optgroup({
              label: 'Numbers'
            })(
              for_(signal(['1', '2']))(
                $value => option({
                  value: $value
                })
              )
            )
          ))).toBe('<select><optgroup label="Numbers"><option value="1"></option><option value="2" selected></option></optgroup></select>')
        })

        it('should leave the own selected of an option out under a value', () => {
          expect(renderToString(() => select({
            value: 'a'
          })(
            option({
              value: 'a'
            }),
            option({
              value: 'b',
              selected: true
            })
          ))).toBe('<select><option value="a" selected></option><option value="b"></option></select>')
        })

        it('should keep the own selected of an option without a value', () => {
          expect(renderToString(() => select()(
            option({
              value: 'a'
            }),
            option({
              value: 'b',
              selected: true
            })
          ))).toBe('<select><option value="a"></option><option value="b" selected></option></select>')
        })

        it('should not select options after the select', () => {
          expect(renderToString(() => fragment(
            select({
              value: 'a'
            }),
            option({
              value: 'a'
            })
          ))).toBe('<select></select><option value="a"></option>')
        })
      })
    })
  })
})
