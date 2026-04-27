export type AuditLog = {
  id: string;
  tenantId: string;
  actorUserId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};
