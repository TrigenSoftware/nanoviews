export interface HrefObject {
  hash: string
  pathname: string
  search: string
}

export interface Location extends HrefObject {
  href: string
}

export interface NavigationUpdate {
  hash?: string
  pathname?: string
  search?: string
  searchParams?: URLSearchParams
}
