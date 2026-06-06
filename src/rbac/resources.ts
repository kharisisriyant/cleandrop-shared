/**
 * Sub-resources within a page that RBAC permissions are defined against.
 *
 * A permission key is `page:resource:action`, e.g. `teams:permissions:write`.
 * Most pages own a single self-named resource; pages with multiple entities
 * (teams, todo lists) split into several resources.
 */
export enum Resource {
  DASHBOARD = "dashboard",
  TODO_LISTS = "todoLists",
  TODO_ITEMS = "todoItems",
  MAP = "map",
  USERS = "users",
  SERVICES = "services",
  BOOKINGS = "bookings",
  PROPERTIES = "properties",
  SETUP_MAP = "setupMap",
  REPORTS = "reports",
  PAYMENTS = "payments",
  PROFILE = "profile",
  TEAMS = "teams",
  MEMBERS = "members",
  PERMISSIONS = "permissions",
  HELP_CENTER = "helpCenter",
  BILLING = "billing",
  CUSTOM_FORMS = "customForms",
  ROLES = "roles",
}

export const RESOURCES = Object.values(Resource);
