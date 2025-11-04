export interface UrlObject {
  hash: string
  pathname: string
  search: string
}

export interface UrlHrefObject extends UrlObject {
  href: string
}

export interface UrlUpdate {
  hash?: string
  pathname?: string
  search?: string
  searchParams?: URLSearchParams
}
