import {
  describe,
  it,
  expect
} from 'vitest'
import {
  div,
  slot,
  span,
  style
} from './elements.js'
import { renderToString } from '../renderToString.js'
import { shadow } from './shadowDom.js'

describe('server', () => {
  describe('elements', () => {
    describe('shadow', () => {
      it('should write the children into a declarative shadow root', () => {
        expect(renderToString(() => shadow(
          div({
            id: 'card'
          }),
          {
            mode: 'open'
          }
        )(
          style()(
            ':host { display: block }'
          ),
          slot()
        ))).toBe('<div id="card"><template shadowrootmode="open"><style>:host { display: block }</style><slot></slot></template></div>')
      })

      it('should write the root first and the light children after it', () => {
        expect(renderToString(() => shadow(
          div()(
            span()(
              'light'
            )
          ),
          {
            mode: 'closed',
            delegatesFocus: true,
            serializable: true,
            clonable: true
          }
        )(
          'shadow'
        ))).toBe('<div><template shadowrootmode="closed" shadowrootdelegatesfocus shadowrootserializable shadowrootclonable>shadow</template><span>light</span></div>')
      })
    })
  })
})
