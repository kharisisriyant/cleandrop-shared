/** Role a user holds within a company. Drives RBAC permission lookups. */
export enum UserCompanyRole {
  DEV_ADMIN = "DEV_ADMIN",
  COMPANY_ADMIN = "COMPANY_ADMIN",
  COMPANY_MANAGER = "COMPANY_MANAGER",
  COMPANY_WORKER = "COMPANY_WORKER",
  CLIENT = "CLIENT",
}

export const USER_COMPANY_ROLES = Object.values(UserCompanyRole);
