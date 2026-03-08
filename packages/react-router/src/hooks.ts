import { hook } from '@nano_kit/react'
import {
  Location$,
  Navigation$,
  Paths$
} from '@nano_kit/router'

/**
 * Get the current route location record from the injection context.
 * @returns Current route location record
 */
export const useLocation$ = /* @__PURE__ */ hook(Location$)

/**
 * Get the navigation API from the injection context.
 * @returns Navigation API
 */
export const useNavigation$ = /* @__PURE__ */ hook(Navigation$)

/**
 * Get the paths object built from the routes from the injection context.
 * @returns Object with path generators for each route
 */
export const usePaths$ = /* @__PURE__ */ hook(Paths$)
