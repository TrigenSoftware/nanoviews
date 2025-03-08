import { Bench } from 'tinybench'
import * as nanostores from 'nanostores'
import * as signals from 'alien-signals'
import * as signals1 from 'alien-signals1'
import * as agera from '../agera/dist/index.js' // 'agera'

const bench = new Bench({
  time: 1000
})

bench
  .add('nanostores / computed', () => {
    const $a = nanostores.atom(0)
    const $b = nanostores.atom(1)
    const $c = nanostores.computed([$a, $b], (a, b) => a + b)
    let value = $c.get()

    $a.set(2)

    value = $c.get()

    $b.set(3)

    value = $c.get()

    const off = $c.listen((nextValue) => {
      value = nextValue
    })

    $a.set(4)
    $b.set(5)

    off()
  })
  .add('alien-signals / computed', () => {
    const $a = signals.signal(0)
    const $b = signals.signal(1)
    const $c = signals.computed(() => $a.get() + $b.get())
    let value = $c.get()

    $a.set(2)

    value = $c.get()

    $b.set(3)

    // value = $c.get()

    const effect = signals.effect(() => {
      value = $c.get()
    })

    $a.set(4)
    $b.set(5)

    effect.stop()
  })
  .add('alien-signals@v1 / computed', () => {
    const $a = signals1.signal(0)
    const $b = signals1.signal(1)
    const $c = signals1.computed(() => $a() + $b())
    let value = $c()

    $a(2)

    value = $c()

    $b(3)

    // value = $c()

    const effect = signals1.effect(() => {
      value = $c()
    })

    $a(4)
    $b(5)

    effect()
  })
  .add('agera / computed', () => {
    const $a = agera.signal(0)
    const $b = agera.signal(1)
    const $c = agera.computed(() => $a() + $b())
    let value = $c()

    $a(2)

    value = $c()

    $b(3)

    // value = $c()

    const effect = agera.effect(() => {
      value = $c()
    })

    $a(4)
    $b(5)

    effect()
  })

await bench.warmup()
await bench.run()

console.table(bench.table())
