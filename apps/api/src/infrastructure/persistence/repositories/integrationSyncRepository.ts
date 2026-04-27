import { IIntegrationSyncRepository } from "../../../application/ports/IIntegrationSyncRepository.js";
import { IntegrationSyncEvent } from "../../../domain/entities/integrationSyncEvent.js";
import { PrismaClient } from "../../../generated/prisma/client.js";

function toDomainIntegrationSyncEvent(row: {
  id: string;
  tenantId: string;
  invoiceId: string;
  externalSystem: string;
  status: IntegrationSyncEvent["status"];
  requestPayload: unknown;
  responsePayload: unknown;
  errorMessage: string | null;
  idempotencyKey: string;
  createdAt: Date;
}): IntegrationSyncEvent {
  return {
    ...row,
    requestPayload: row.requestPayload as Record<string, unknown> | null,
    responsePayload: row.responsePayload as Record<string, unknown> | null,
  };
}

export class IntegrationSyncRepository implements IIntegrationSyncRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(params: {
    tenantId: string;
    invoiceId: string;
    externalSystem: string;
    status: "SUCCESS" | "FAILED";
    requestPayload?: Record<string, unknown>;
    responsePayload?: Record<string, unknown>;
    errorMessage?: string;
    idempotencyKey: string;
  }): Promise<IntegrationSyncEvent> {
    const row = await this.prisma.integrationSyncEvent.create({
      data: {
        tenantId: params.tenantId,
        invoiceId: params.invoiceId,
        externalSystem: params.externalSystem,
        status: params.status,
        requestPayload: params.requestPayload
          ? JSON.parse(JSON.stringify(params.requestPayload))
          : undefined,
        responsePayload: params.responsePayload
          ? JSON.parse(JSON.stringify(params.responsePayload))
          : undefined,
        errorMessage: params.errorMessage,
        idempotencyKey: params.idempotencyKey,
      },
    });

    return toDomainIntegrationSyncEvent(row);
  }

  async listForTenant(params: {
    tenantId: string;
  }): Promise<IntegrationSyncEvent[]> {
    const rows = await this.prisma.integrationSyncEvent.findMany({
      where: {
        tenantId: params.tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(toDomainIntegrationSyncEvent);
  }
}
