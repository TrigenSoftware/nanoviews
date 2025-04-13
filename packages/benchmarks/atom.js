import { Bench } from 'tinybench'
import * as nanostores from 'nanostores'
import * as signals from 'alien-signals'
import * as agera from '../agera/dist/index.js' // 'agera'

const bench = new Bench({
  time: 1000
})

bench
  .add('nanostores / atom', () => {
    const $store = nanostores.atom(0)

    $store.set($store.get() + 1)
  })
  .add('alien-signals / signal', () => {
    const $store = signals.signal(0)

    $store($store() + 1)
  })
  .add('agera / signal', () => {
    const $store = agera.signal(0)

    $store($store() + 1)
  })

await bench.run()

console.table(bench.table())
