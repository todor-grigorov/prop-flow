import { Role } from "../../domain/enums/role.js";

export type RequestContext = {
  userId: string;
  tenantId: string;
  role: Role;
};
