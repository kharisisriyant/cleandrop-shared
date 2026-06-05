# @cleandrop/shared

Shared constants, enums, and types for the CleanDrop backend and frontend repos.

## Build

```bash
npm install
npm run build      # dual ESM + CJS + .d.ts into dist/
npm run typecheck
```

## RBAC

Three enums plus a permission matrix and lookup helpers.

- `UserCompanyRole` — `DEV_ADMIN`, `COMPANY_ADMIN`, `COMPANY_MANAGER`, `COMPANY_WORKER`, `CLIENT`
- `Resource` — `dashboard`, `todoLists`, `mapView`, `users`, … `roles`
- `Action` — `READ` (`R`), `WRITE` (`W`), `DELETE` (`D`)
- `RBAC_MATRIX` — `Resource -> UserCompanyRole -> "RWD"` permission code

### Usage

```ts
import { can, getActions, Resource, Action, UserCompanyRole } from "@cleandrop/shared";

can(UserCompanyRole.COMPANY_ADMIN, Resource.TODO_LISTS, Action.DELETE); // true
can(UserCompanyRole.COMPANY_WORKER, Resource.USERS, Action.READ);       // false

getActions(UserCompanyRole.CLIENT, Resource.PROPERTIES); // [Action.READ, Action.WRITE]
```

Helpers:

- `can(role, resource, action): boolean`
- `getActions(role, resource): Action[]`
- `getPermissionCode(role, resource): string` — raw code, e.g. `"RWD"`
