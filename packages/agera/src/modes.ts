import type {
  AnySignal,
  ReadableSignal,
  Mountable,
  AnyWritableSignal,
  AnyReadableSignal,
  AnyAccessor,
  AccessorValue
} from './internals/types.js'
import {
  MountableFlag,
  WritableFlag
} from './internals/flags.js'
import { markMountableUsed } from './internals/lifecycle.js'

/* @__NO_SIDE_EFFECTS__ */
export function isMountable<T extends Mountable<AnySignal> = Mountable<AnySignal>>(value: AnyAccessor): value is T {
  return ((value as AnyWritableSignal).node?.modes & MountableFlag) > 0
}

export function unsafeMarkMountable($signal: AnySignal) {
  $signal.node.modes |= MountableFlag
}

/**
 * Mark a signal as mountable.
 * @param $signal
 * @returns The mountable signal.
 */
/* @__NO_SIDE_EFFECTS__ */
export function mountable<T extends AnySignal>($signal: T): Mountable<T> {
  markMountableUsed()
  unsafeMarkMountable($signal)

  return $signal as Mountable<T>
}

/* @__NO_SIDE_EFFECTS__ */
export function isWritable<T extends AnyWritableSignal = AnyWritableSignal>(value: AnyAccessor): value is T {
  return ((value as AnyWritableSignal).node?.modes & WritableFlag) > 0
}

export function unsafeMarkWritable($signal: AnySignal) {
  $signal.node.modes |= WritableFlag
}

/**
 * Mark a signal as readonly.
 * @param $signal
 * @returns The readonly signal.
 */
/* @__NO_SIDE_EFFECTS__ */
export function readonly<T extends AnyAccessor>($signal: T) {
  if (isWritable($signal)) {
    ($signal as AnyReadableSignal).node.modes &= ~WritableFlag
  }

  return $signal as T extends Mountable<AnyWritableSignal>
    ? Mountable<ReadableSignal<AccessorValue<T>>>
    : T extends AnyWritableSignal
      ? ReadableSignal<AccessorValue<T>>
      : T
}
