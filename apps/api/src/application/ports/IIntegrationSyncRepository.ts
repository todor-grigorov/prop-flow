import { IntegrationSyncEvent } from "../../domain/entities/integrationSyncEvent.js";

export interface IIntegrationSyncRepository {
  create(params: {
    tenantId: string;
    invoiceId: string;
    externalSystem: string;
    status: "SUCCESS" | "FAILED";
    requestPayload?: Record<string, unknown>;
    responsePayload?: Record<string, unknown>;
    errorMessage?: string;
    idempotencyKey: string;
  }): Promise<IntegrationSyncEvent>;

  listForTenant(params: { tenantId: string }): Promise<IntegrationSyncEvent[]>;
}
