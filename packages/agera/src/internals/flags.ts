export const ComputedSubscriberFlag = 1 << 0

export const EffectSubscriberFlag = 1 << 1

export const EffectScopeSubscriberFlag = 1 << 2

export const LazyEffectSubscriberFlag = 1 << 3

export const TrackingSubscriberFlag = 1 << 4

export const NotifiedSubscriberFlag = 1 << 5

export const RecursedSubscriberFlag = 1 << 6

export const DirtySubscriberFlag = 1 << 7

export const PendingComputedSubscriberFlag = 1 << 8

export const PendingEffectSubscriberFlag = 1 << 9

export const WritableSignalFlag = 1 << 10

export const MountableSignalFlag = 1 << 11

export const PropagatedSubscriberFlag = DirtySubscriberFlag | PendingComputedSubscriberFlag | PendingEffectSubscriberFlag
