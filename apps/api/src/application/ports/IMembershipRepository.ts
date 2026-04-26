import { Membership } from "../../domain/entities/membership.js";

export interface IMembershipRepository {
  findByUserAndTenant(params: {
    userId: string;
    tenantId: string;
  }): Promise<Membership | null>;

  findFirstByUserId(userId: string): Promise<Membership | null>;
}
