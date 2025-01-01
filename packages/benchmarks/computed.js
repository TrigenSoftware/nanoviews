import { Bench } from 'tinybench'
import * as nanostores from 'nanostores'
import * as signals from 'alien-signals'
import * as kida from '../kida/dist/index.production.js' // 'kida'

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
  .add('kida / computed', () => {
    const $a = kida.signal(0)
    const $b = kida.signal(1)
    const $c = kida.computed(get => get($a) + get($b))
    let value = $c.get()

    $a.set(2)

    value = $c.get()

    $b.set(3)

    value = $c.get()

    const off = kida.listen($c, (nextValue) => {
      value = nextValue
    })

    $a.set(4)
    $b.set(5)

    off()
  })

await bench.warmup()
await bench.run()

console.table(bench.table())
