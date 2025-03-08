/* eslint-disable @typescript-eslint/no-magic-numbers */
export const ComputedSubscriberFlag = 1 << 0

export const EffectSubscriberFlag = 1 << 1

export const TrackingSubscriberFlag = 1 << 2

export const NotifiedSubscriberFlag = 1 << 3

export const RecursedSubscriberFlag = 1 << 4

export const DirtySubscriberFlag = 1 << 5

export const PendingComputedSubscriberFlag = 1 << 6

export const PendingEffectSubscriberFlag = 1 << 7

export const LazyEffectSubscriberFlag = 1 << 8

export const PropagatedSubscriberFlag = DirtySubscriberFlag | PendingComputedSubscriberFlag | PendingEffectSubscriberFlag
/* eslint-enable @typescript-eslint/no-magic-numbers */
