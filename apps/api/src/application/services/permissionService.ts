import { Permission } from "../../domain/enums/permission.js";
import { Role } from "../../domain/enums/role.js";

const rolePermissions: Record<Role, Permission[]> = {
  OWNER: [
    "document:create",
    "document:read",
    "invoice:read",
    "invoice:approve",
    "invoice:reject",
    "auditLog:read",
    "integration:read",
    "integration:retry",
  ],
  ADMIN: [
    "document:create",
    "document:read",
    "invoice:read",
    "invoice:approve",
    "invoice:reject",
    "auditLog:read",
    "integration:read",
    "integration:retry",
  ],
  REVIEWER: [
    "document:read",
    "invoice:read",
    "invoice:approve",
    "invoice:reject",
    "auditLog:read",
  ],
  READ_ONLY: [
    "document:read",
    "invoice:read",
    "auditLog:read",
    "integration:read",
  ],
};

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}
