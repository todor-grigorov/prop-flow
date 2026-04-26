import { IMembershipRepository } from "../../../application/ports/IMembershipRepository.js";
import { Membership } from "../../../domain/entities/membership.js";
import { PrismaClient } from "../../../generated/prisma/client.js";

export class MembershipRepository implements IMembershipRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserAndTenant(params: {
    userId: string;
    tenantId: string;
  }): Promise<Membership | null> {
    return this.prisma.membership.findUnique({
      where: {
        userId_tenantId: {
          userId: params.userId,
          tenantId: params.tenantId,
        },
      },
    });
  }

  async findFirstByUserId(userId: string): Promise<Membership | null> {
    return this.prisma.membership.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
