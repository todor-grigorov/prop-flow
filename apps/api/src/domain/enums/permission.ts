export type Permission =
  | "document:create"
  | "document:read"
  | "invoice:read"
  | "invoice:approve"
  | "invoice:reject"
  | "auditLog:read"
  | "integration:read"
  | "integration:retry";
