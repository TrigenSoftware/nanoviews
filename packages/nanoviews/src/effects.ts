import {
  type Observer,
  type Runner,
  observe
} from 'kida'
import { addEffect } from './internals/index.js'

export { addEffect as effect$ }

export function observe$(
  observer: Observer,
  runner?: Runner
) {
  addEffect(() => observe(observer, runner))
}
