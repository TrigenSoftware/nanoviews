
import {
  type AnySignal,
  type ReadableSignal,
  type Mountable,
  type AnyWritableSignal,
  type AnyReadableSignal,
  type AnyAccessor,
  type AccessorValue,
  WritableSignalFlag,
  MountableSignalFlag,
  markMountableUsed
} from './internals/index.js'

/* @__NO_SIDE_EFFECTS__ */
export function isMountable<T extends Mountable<AnySignal> = Mountable<AnySignal>>(value: AnyAccessor): value is T {
  return ((value as AnyWritableSignal).signal?.flags & MountableSignalFlag) > 0
}

export function unsafeMarkMountable($signal: AnySignal) {
  $signal.signal.flags |= MountableSignalFlag
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
  return ((value as AnyWritableSignal).signal?.flags & WritableSignalFlag) > 0
}

export function unsafeMarkWritable($signal: AnySignal) {
  $signal.signal.flags |= WritableSignalFlag
}

/**
 * Mark a signal as readonly.
 * @param $signal
 * @returns The readonly signal.
 */
/* @__NO_SIDE_EFFECTS__ */
export function readonly<T extends AnyAccessor>($signal: T) {
  if (isWritable($signal)) {
    ($signal as AnyReadableSignal).signal.flags &= ~WritableSignalFlag
  }

  return $signal as T extends Mountable<AnyWritableSignal>
    ? Mountable<ReadableSignal<AccessorValue<T>>>
    : T extends AnyWritableSignal
      ? ReadableSignal<AccessorValue<T>>
      : T
}
