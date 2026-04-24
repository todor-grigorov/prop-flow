import { Role } from "../enums/role.js";

export type Membership = {
  id: string;
  userId: string;
  tenantId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};
