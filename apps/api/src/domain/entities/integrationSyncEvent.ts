export type SyncStatus = "PENDING" | "SUCCESS" | "FAILED";

export type IntegrationSyncEvent = {
  id: string;
  tenantId: string;
  invoiceId: string;
  externalSystem: string;
  status: SyncStatus;
  requestPayload: Record<string, unknown> | null;
  responsePayload: Record<string, unknown> | null;
  errorMessage: string | null;
  idempotencyKey: string;
  createdAt: Date;
};
