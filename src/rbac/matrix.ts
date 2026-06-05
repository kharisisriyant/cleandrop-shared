import { Action } from "./actions.js";
import { Resource } from "./resources.js";
import { UserCompanyRole } from "./roles.js";

/** Permission code string, e.g. "RWD", "RW", "R", or "" for no access. */
export type PermissionCode = string;

/** Per-role permission codes for a single resource. */
export type ResourcePermissions = Record<UserCompanyRole, PermissionCode>;

/** Full RBAC matrix: resource -> role -> permission code. */
export const RBAC_MATRIX: Record<Resource, ResourcePermissions> = {
  [Resource.DASHBOARD]:        { DEV_ADMIN: "R",   COMPANY_ADMIN: "R",   COMPANY_MANAGER: "R",   COMPANY_WORKER: "R",  CLIENT: "R"  },
  [Resource.TODO_LISTS]:       { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RWD", COMPANY_WORKER: "RW", CLIENT: "R"  },
  [Resource.MAP_VIEW]:         { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RW",  COMPANY_WORKER: "R",  CLIENT: "R"  },
  [Resource.USERS]:            { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RW",  COMPANY_WORKER: "",   CLIENT: ""   },
  [Resource.SERVICES]:         { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RW",  COMPANY_WORKER: "R",  CLIENT: "R"  },
  [Resource.BOOKINGS]:         { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RWD", COMPANY_WORKER: "R",  CLIENT: "R"  },
  [Resource.PROPERTIES]:       { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RWD", COMPANY_WORKER: "R",  CLIENT: "RW" },
  [Resource.SETUP_MAP]:        { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RW",  COMPANY_WORKER: "",   CLIENT: ""   },
  [Resource.REPORTS]:          { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "R",   COMPANY_WORKER: "",   CLIENT: ""   },
  [Resource.PAYMENTS]:         { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RW",  COMPANY_WORKER: "",   CLIENT: "R"  },
  [Resource.PROFILE_SETTINGS]: { DEV_ADMIN: "RW",  COMPANY_ADMIN: "RW",  COMPANY_MANAGER: "RW",  COMPANY_WORKER: "RW", CLIENT: "RW" },
  [Resource.TEAMS]:            { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RW",  COMPANY_WORKER: "",   CLIENT: ""   },
  [Resource.HELP_CENTER]:      { DEV_ADMIN: "R",   COMPANY_ADMIN: "R",   COMPANY_MANAGER: "R",   COMPANY_WORKER: "R",  CLIENT: "R"  },
  [Resource.BILLING]:          { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "R",   COMPANY_WORKER: "",   CLIENT: ""   },
  [Resource.CUSTOM_FORMS]:     { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "RW",  COMPANY_WORKER: "R",  CLIENT: ""   },
  [Resource.ROLES]:            { DEV_ADMIN: "RWD", COMPANY_ADMIN: "RWD", COMPANY_MANAGER: "",    COMPANY_WORKER: "",   CLIENT: ""   },
};

/** Permission code letter for a given action. */
const ACTION_CODE: Record<Action, string> = {
  [Action.READ]: "R",
  [Action.WRITE]: "W",
  [Action.DELETE]: "D",
};

/** Permission string for a resource + action, e.g. `users:read`. */
export type Permission = `${Resource}:${Action}`;

/** Build a permission string, e.g. buildPermission(USERS, READ) => "users:read". */
export function buildPermission(resource: Resource, action: Action): Permission {
  return `${resource}:${action}`;
}

/** Raw permission code for a role on a resource ("" if no access). */
export function getPermissionCode(
  role: UserCompanyRole,
  resource: Resource,
): PermissionCode {
  return RBAC_MATRIX[resource][role];
}

/** Whether a role may perform an action on a resource. */
export function can(
  role: UserCompanyRole,
  resource: Resource,
  action: Action,
): boolean {
  return getPermissionCode(role, resource).includes(ACTION_CODE[action]);
}

/** All actions a role may perform on a resource. */
export function getActions(
  role: UserCompanyRole,
  resource: Resource,
): Action[] {
  const code = getPermissionCode(role, resource);
  return (Object.values(Action) as Action[]).filter((a) =>
    code.includes(ACTION_CODE[a]),
  );
}
