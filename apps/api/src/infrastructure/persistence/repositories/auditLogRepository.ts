import { IAuditLogRepository } from "../../../application/ports/IAuditLogRepository.js";
import { AuditLog } from "../../../domain/entities/auditLog.js";
import { PrismaClient } from "../../../generated/prisma/client.js";

function toDomainAuditLog(row: {
  id: string;
  tenantId: string;
  actorUserId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  metadata: unknown;
  createdAt: Date;
}): AuditLog {
  return {
    ...row,
    metadata: row.metadata as Record<string, unknown> | null,
  };
}

export class AuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    action: string;
    metadata?: Record<string, unknown>;
  }): Promise<AuditLog> {
    const row = await this.prisma.auditLog.create({
      data: {
        tenantId: params.tenantId,
        actorUserId: params.actorUserId,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        metadata: params.metadata
          ? JSON.parse(JSON.stringify(params.metadata))
          : undefined,
      },
    });

    return toDomainAuditLog(row);
  }

  async listForTenant(params: { tenantId: string }): Promise<AuditLog[]> {
    const rows = await this.prisma.auditLog.findMany({
      where: {
        tenantId: params.tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(toDomainAuditLog);
  }
}
