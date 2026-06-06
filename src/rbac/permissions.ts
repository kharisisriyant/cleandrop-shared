import { Action } from "./actions.js";
import { Page } from "./pages.js";
import { Resource } from "./resources.js";
import { UserCompanyRole } from "./roles.js";

/**
 * Permission scope — a `page:resource` pair, e.g. `teams:members`.
 * The unit a role grant is defined against.
 */
export type PermissionScope = `${Page}:${Resource}`;

/**
 * Permission key — the canonical `page:resource:action` string used by both
 * backend guards (`@Permissions("teams:members:write")`) and the frontend
 * (`can(role, ...)` / allow-block checks). The single shared identifier.
 */
export type PermissionKey = `${Page}:${Resource}:${Action}`;

/** Compact permission code, a subset of "RWD" ("" = no access). */
export type PermissionCode = string;

/** Per-role permission codes for a single scope. */
export type ScopeGrants = Record<UserCompanyRole, PermissionCode>;

/** A `page:resource` scope: which actions exist, and the default role grants. */
export interface PermissionScopeDef {
  page: Page;
  resource: Resource;
  /** Actions that are meaningful for this scope (the catalog of valid keys). */
  actions: Action[];
  /** Default permission code per role (the seed/fallback matrix). */
  roles: ScopeGrants;
}

/** Permission code letter for a given action. */
const ACTION_CODE: Record<Action, string> = {
  [Action.READ]: "R",
  [Action.WRITE]: "W",
  [Action.DELETE]: "D",
};

/** Build a `page:resource` scope string. */
export function buildPermissionScope(
  page: Page,
  resource: Resource,
): PermissionScope {
  return `${page}:${resource}`;
}

/** Build a `page:resource:action` permission key. */
export function buildPermissionKey(
  page: Page,
  resource: Resource,
  action: Action,
): PermissionKey {
  return `${page}:${resource}:${action}`;
}

const RWD: Action[] = [Action.READ, Action.WRITE, Action.DELETE];
const RW: Action[] = [Action.READ, Action.WRITE];
const R: Action[] = [Action.READ];

/** Shorthand for a role-grants record, ordered DA, CA, CM, CW, CLIENT. */
const grants = (
  devAdmin: PermissionCode,
  companyAdmin: PermissionCode,
  companyManager: PermissionCode,
  companyWorker: PermissionCode,
  client: PermissionCode,
): ScopeGrants => ({
  [UserCompanyRole.DEV_ADMIN]: devAdmin,
  [UserCompanyRole.COMPANY_ADMIN]: companyAdmin,
  [UserCompanyRole.COMPANY_MANAGER]: companyManager,
  [UserCompanyRole.COMPANY_WORKER]: companyWorker,
  [UserCompanyRole.CLIENT]: client,
});

/**
 * The RBAC catalog — single source of truth.
 *
 * Each entry declares a `page:resource` scope, the actions that exist for it,
 * and the default permission code per role. Permission keys, role-default key
 * lists, and `can()` checks are all derived from this.
 */
export const PERMISSION_SCOPES: PermissionScopeDef[] = [
  // page              resource              actions  DA     CA     CM     CW    CLIENT
  { page: Page.DASHBOARD,        resource: Resource.DASHBOARD,    actions: R,   roles: grants("R",   "R",   "R",   "R",  "R")  },

  { page: Page.TODO_LISTS,       resource: Resource.TODO_LISTS,   actions: RWD, roles: grants("RWD", "RWD", "RWD", "RW", "R")  },
  { page: Page.TODO_LISTS,       resource: Resource.TODO_ITEMS,   actions: RWD, roles: grants("RWD", "RWD", "RWD", "RW", "R")  },

  { page: Page.MAP_VIEW,         resource: Resource.MAP,          actions: R,   roles: grants("R",   "R",   "R",   "R",  "R")  },

  { page: Page.USERS,            resource: Resource.USERS,        actions: RWD, roles: grants("RWD", "RWD", "RW",  "",   "")   },

  { page: Page.SERVICES,         resource: Resource.SERVICES,     actions: RWD, roles: grants("RWD", "RWD", "RW",  "R",  "R")  },

  { page: Page.BOOKINGS,         resource: Resource.BOOKINGS,     actions: RWD, roles: grants("RWD", "RWD", "RWD", "R",  "R")  },

  { page: Page.PROPERTIES,       resource: Resource.PROPERTIES,   actions: RWD, roles: grants("RWD", "RWD", "RWD", "R",  "RW") },

  { page: Page.SETUP_MAP,        resource: Resource.SETUP_MAP,    actions: RWD, roles: grants("RWD", "RWD", "RW",  "",   "")   },

  { page: Page.REPORTS,          resource: Resource.REPORTS,      actions: R,   roles: grants("R",   "R",   "R",   "",   "")   },

  { page: Page.PAYMENTS,         resource: Resource.PAYMENTS,     actions: RWD, roles: grants("RWD", "RWD", "RW",  "",   "R")  },

  { page: Page.PROFILE_SETTINGS, resource: Resource.PROFILE,      actions: RW,  roles: grants("RW",  "RW",  "RW",  "RW", "RW") },

  // Teams page — three resources.
  { page: Page.TEAMS,            resource: Resource.TEAMS,        actions: RWD, roles: grants("RWD", "RWD", "RW",  "",   "")   },
  { page: Page.TEAMS,            resource: Resource.MEMBERS,      actions: RWD, roles: grants("RWD", "RWD", "RW",  "",   "")   },
  { page: Page.TEAMS,            resource: Resource.PERMISSIONS,  actions: RWD, roles: grants("RWD", "RWD", "R",   "",   "")   },

  { page: Page.HELP_CENTER,      resource: Resource.HELP_CENTER,  actions: R,   roles: grants("R",   "R",   "R",   "R",  "R")  },

  { page: Page.BILLING,          resource: Resource.BILLING,      actions: RWD, roles: grants("RWD", "RWD", "R",   "",   "")   },

  { page: Page.CUSTOM_FORMS,     resource: Resource.CUSTOM_FORMS, actions: RWD, roles: grants("RWD", "RWD", "RW",  "R",  "")   },

  { page: Page.ROLES,            resource: Resource.ROLES,        actions: RWD, roles: grants("RWD", "RWD", "",    "",   "")   },
];

/** Lookup of scope definition by `page:resource` string. */
export const PERMISSION_SCOPE_INDEX: Record<PermissionScope, PermissionScopeDef> =
  Object.fromEntries(
    PERMISSION_SCOPES.map((s) => [buildPermissionScope(s.page, s.resource), s]),
  ) as Record<PermissionScope, PermissionScopeDef>;

/** Every valid permission key in the catalog. */
export const PERMISSION_KEYS: PermissionKey[] = PERMISSION_SCOPES.flatMap((s) =>
  s.actions.map((a) => buildPermissionKey(s.page, s.resource, a)),
);

const PERMISSION_KEY_SET = new Set<string>(PERMISSION_KEYS);

/** Whether a string is a known permission key. */
export function isPermissionKey(value: string): value is PermissionKey {
  return PERMISSION_KEY_SET.has(value);
}

/** Default permission keys granted to each role (derived from the catalog). */
export const ROLE_DEFAULT_PERMISSIONS: Record<UserCompanyRole, PermissionKey[]> =
  Object.fromEntries(
    Object.values(UserCompanyRole).map((role) => [
      role,
      PERMISSION_SCOPES.flatMap((s) => {
        const code = s.roles[role] ?? "";
        return s.actions
          .filter((a) => code.includes(ACTION_CODE[a]))
          .map((a) => buildPermissionKey(s.page, s.resource, a));
      }),
    ]),
  ) as Record<UserCompanyRole, PermissionKey[]>;

/** Raw default permission code for a role on a scope ("" if none / unknown). */
export function getPermissionCode(
  role: UserCompanyRole,
  page: Page,
  resource: Resource,
): PermissionCode {
  return PERMISSION_SCOPE_INDEX[buildPermissionScope(page, resource)]?.roles[role] ?? "";
}

/** Whether a role may perform an action on a `page:resource` scope, by default. */
export function can(
  role: UserCompanyRole,
  page: Page,
  resource: Resource,
  action: Action,
): boolean {
  return getPermissionCode(role, page, resource).includes(ACTION_CODE[action]);
}

/** All actions a role may perform on a `page:resource` scope, by default. */
export function getActions(
  role: UserCompanyRole,
  page: Page,
  resource: Resource,
): Action[] {
  const scope = PERMISSION_SCOPE_INDEX[buildPermissionScope(page, resource)];
  if (!scope) return [];
  const code = scope.roles[role] ?? "";
  return scope.actions.filter((a) => code.includes(ACTION_CODE[a]));
}

/** Whether an explicit set of granted keys allows a permission. */
export function hasPermission(
  granted: Iterable<string>,
  key: PermissionKey,
): boolean {
  for (const g of granted) if (g === key) return true;
  return false;
}
