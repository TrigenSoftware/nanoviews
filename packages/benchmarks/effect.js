import { Bench } from 'tinybench'
import * as nanostores from 'nanostores'
import * as signals from 'alien-signals'
import * as agera from '../agera/dist/index.js' // 'agera'

const bench = new Bench({
  time: 1000
})

bench
  .add('nanostores / effect', () => {
    const $store = nanostores.atom(0)
    const logs = []

    nanostores.effect([$store], (store) => {
      logs.push(store)
    })

    $store.set($store.get() + 1)
    $store.set($store.get() + 1)

    console.assert(logs.length === 3)
  })
  .add('alien-signals / effect', () => {
    const $store = signals.signal(0)
    const logs = []

    signals.effect(() => {
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

await bench.run()

console.table(bench.table())
