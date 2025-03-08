import { Bench } from 'tinybench'
import * as signals from 'alien-signals'
import * as signals1 from 'alien-signals1'
import * as agera from '../agera/dist/index.js' // 'agera'

const bench = new Bench({
  time: 1000
})

bench
  .add('alien-signals / effect', () => {
    const $store = signals.signal(0)
    const logs = []

    signals.effect(() => {
      logs.push($store.get())
    })

    $store.set($store.get() + 1)
    $store.set($store.get() + 1)

    console.assert(logs.length === 3)
  })
  .add('alien-signals@v1 / effect', () => {
    const $store = signals1.signal(0)
    const logs = []

    signals1.effect(() => {
      logs.push($store())
    })

    $store($store() + 1)
    $store($store() + 1)

    console.assert(logs.length === 3)
  })
  .add('agera / effect', () => {
    const $store = agera.signal(0)
    const logs = []

    agera.effect(() => {
      logs.push($store())
    })

    $store($store() + 1)
    $store($store() + 1)

    console.assert(logs.length === 3)
  })

await bench.warmup()
await bench.run()

console.table(bench.table())
