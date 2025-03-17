import { Bench } from 'tinybench'
import * as signals1 from 'alien-signals1'
import * as agera from '../agera/dist/index.js' // 'agera'

const bench = new Bench({
  time: 1000
})
const effectScope = agera.createEffectScope()

bench
  .add('alien-signals@v1 / effectScope', () => {
    const $a = signals1.signal(0)
    const $b = signals1.signal(0)
    const destroy = signals1.effectScope(() => {
      signals1.effect(() => {
        $a()
      })
      signals1.effect(() => {
        $a()
        $b()
      })
    })

    destroy()
  })
  .add('agera / effectScope', () => {
    const $a = agera.signal(0)
    const $b = agera.signal(0)
    const destroy = agera.effectScope(() => {
      agera.effect(() => {
        $a()
      })
      agera.effect(() => {
        $a()
        $b()
      })
    })

    destroy()
  })
  .add('agera / effectScope single instance', () => {
    const $a = agera.signal(0)
    const $b = agera.signal(0)
    const destroy = effectScope(() => {
      agera.effect(() => {
        $a()
      })
      agera.effect(() => {
        $a()
        $b()
      })
    })

    destroy()
  })

await bench.warmup()
await bench.run()

console.table(bench.table())
