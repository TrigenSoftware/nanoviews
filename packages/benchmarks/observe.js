import { Bench } from 'tinybench'
import * as signals from 'alien-signals'
import * as kida from '../kida/dist/index.production.js' // 'kida'

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
  .add('kida / observe', () => {
    const $store = kida.signal(0)
    const logs = []

    kida.observe((get) => {
      logs.push(get($store))
    })

    $store.set($store.get() + 1)
    $store.set($store.get() + 1)

    console.assert(logs.length === 3)
  })

await bench.warmup()
await bench.run()

console.table(bench.table())
