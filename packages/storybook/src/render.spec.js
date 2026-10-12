import {
  describe,
  it,
  expect
} from 'vitest'
import {
  button,
  component$
} from 'nanoviews'
import {
  applyDecorators,
  render,
  renderToCanvas
} from './render.js'

// Renders a story the way Storybook does: the canvas stays, and every render brings the current args
function createCanvas(component) {
  const canvasElement = document.createElement('div')
  const storyFn = applyDecorators(context => render(context.args, context), [])

  return {
    canvasElement,
    render(args) {
      const storyContext = {
        args,
        globals: {},
        canvasElement,
        component
      }

      renderToCanvas({
        storyFn: () => storyFn(storyContext),
        showMain() {},
        forceRemount: false,
        storyContext
      }, canvasElement)
    }
  }
}

describe('storybook', () => {
  describe('render', () => {
    describe('renderToCanvas', () => {
      const Counter = component$(({ count, label }) => button({
        onClick() {
          count(count() + 1)
        }
      })(
        label, ': ', count
      ))

      it('should write an arg that changed into its signal', () => {
        const canvas = createCanvas(Counter)

        canvas.render({
          count: 0,
          label: 'Clicks'
        })
        canvas.canvasElement.querySelector('button').click()
        canvas.render({
          count: 5,
          label: 'Clicks'
        })

        expect(canvas.canvasElement.innerHTML).toBe('<button>Clicks: 5</button>')
      })

      it('should write an arg that changed back to its first value', () => {
        const canvas = createCanvas(Counter)

        canvas.render({
          count: 0,
          label: 'Clicks'
        })
        canvas.render({
          count: 5,
          label: 'Clicks'
        })
        canvas.render({
          count: 0,
          label: 'Clicks'
        })

        expect(canvas.canvasElement.innerHTML).toBe('<button>Clicks: 0</button>')
      })

      it('should keep a value the story wrote into its arg signal when another arg changes', () => {
        const canvas = createCanvas(Counter)

        canvas.render({
          count: 0,
          label: 'Clicks'
        })
        canvas.canvasElement.querySelector('button').click()
        canvas.render({
          count: 0,
          label: 'Taps'
        })

        expect(canvas.canvasElement.innerHTML).toBe('<button>Taps: 1</button>')
      })
    })
  })
})
