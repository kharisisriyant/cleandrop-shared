/** App resources that RBAC permissions are defined against. */
export enum Resource {
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

export const RESOURCES = Object.values(Resource);
