/**
 * App pages — the top-level area a permission belongs to.
 *
 * A permission key is `page:resource:action`, e.g. `teams:members:write`.
 * The `page` segment usually maps 1:1 to a sidebar/menu entry.
 */
export enum Page {
  DASHBOARD = "dashboard",
  TODO_LISTS = "todoLists",
  MAP_VIEW = "mapView",
  USERS = "users",
  SERVICES = "services",
  BOOKINGS = "bookings",
  PROPERTIES = "properties",
  SETUP_MAP = "setupMap",
  REPORTS = "reports",
  PAYMENTS = "payments",
  PROFILE_SETTINGS = "profileSettings",
  TEAMS = "teams",
  HELP_CENTER = "helpCenter",
  BILLING = "billing",
  CUSTOM_FORMS = "customForms",
  ROLES = "roles",
}

export const PAGES = Object.values(Page);
