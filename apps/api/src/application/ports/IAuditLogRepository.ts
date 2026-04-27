import { AuditLog } from "../../domain/entities/auditLog.js";

export interface IAuditLogRepository {
  create(params: {
    tenantId: string;
    actorUserId: string | null;
    entityType: string;
    entityId: string;
    action: string;
    metadata?: Record<string, unknown>;
  }): Promise<AuditLog>;

  listForTenant(params: { tenantId: string }): Promise<AuditLog[]>;
}
