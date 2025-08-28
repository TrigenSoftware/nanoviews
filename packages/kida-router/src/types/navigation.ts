import type {
  ReadableRecord,
  ReadableSignal
} from 'kida'
import type {
  Location,
  NavigationUpdate
} from './common.js'

export type VirtualAction = 'push' | 'replace' | null

export interface VirtualLocation extends Location {
  action: VirtualAction
}

export interface Navigation {
  go(steps: number): void
  back(): void
  forward(): void
  push(to: string | NavigationUpdate): void
  replace(to: string | NavigationUpdate): void
}

export type LocationSignal = ReadableSignal<Location>

export type LocationRecord = ReadableRecord<LocationSignal>

export type VirtualLocationSignal = ReadableSignal<VirtualLocation>

export type VirtualLocationRecord = ReadableRecord<VirtualLocationSignal>

export type SearchParamsSignal = ReadableSignal<URLSearchParams>
