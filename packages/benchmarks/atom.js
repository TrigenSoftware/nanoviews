import { Bench } from 'tinybench'
import * as nanostores from 'nanostores'
import * as signals from 'alien-signals'
import * as kida from '../kida/dist/index.production.js' // 'kida'

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

    $store.set($store.get() + 1)
  })
  .add('kida / signal', () => {
    const $store = kida.signal(0)

    $store.set($store.get() + 1)
  })

await bench.warmup()
await bench.run()

console.table(bench.table())
