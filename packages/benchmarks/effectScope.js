import { Bench } from 'tinybench'
import * as signals from 'alien-signals'
import * as agera from '../agera/dist/index.js' // 'agera'

const bench = new Bench({
  time: 1000
})
const effectScope = agera.createEffectScope()

bench
  .add('alien-signals@v1 / effectScope', () => {
    const $a = signals.signal(0)
    const $b = signals.signal(0)
    const destroy = signals.effectScope(() => {
      signals.effect(() => {
        $a()
      })
      signals.effect(() => {
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
  .add('agera / effectScope + mountable', () => {
    const $a = agera.mountable(agera.signal(0))
    const $b = agera.mountable(agera.signal(0))
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
