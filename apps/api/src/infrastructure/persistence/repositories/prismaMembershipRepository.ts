import { MembershipRepository } from "../../../application/ports/membershipRepository.js";
import { Membership } from "../../../domain/entities/membership.js";
import { PrismaClient } from "../../../generated/prisma/client.js";

export class PrismaMembershipRepository implements MembershipRepository {
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
