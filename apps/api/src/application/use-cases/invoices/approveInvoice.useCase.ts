import { RequestContext } from "../../dto/requestContext.js";
import { IAuditLogRepository } from "../../ports/IAuditLogRepository.js";
import { IErpClient } from "../../ports/IErpClient.js";
import { IIntegrationSyncRepository } from "../../ports/IIntegrationSyncRepository.js";
import { IInvoiceRepository } from "../../ports/IInvoiceRepository.js";
import { IOutboxRepository } from "../../ports/IOutboxRepository.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../../../domain/errors/applicationError.js";
import { can } from "../../services/permissionService.js";

// This is a pragmatic version. In production, the ERP sync would be processed by a background worker. For now, we create the outbox event and process it immediately.

export class ApproveInvoiceUseCase {
  constructor(
    private readonly invoiceRepository: IInvoiceRepository,
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly outboxRepository: IOutboxRepository,
    private readonly integrationSyncRepository: IIntegrationSyncRepository,
    private readonly erpClient: IErpClient,
  ) {}

  async execute(input: { context: RequestContext; invoiceId: string }) {
    if (!can(input.context.role, "invoice:approve")) {
      throw new ForbiddenError("Missing permission: invoice:approve");
    }

    const invoice = await this.invoiceRepository.findByIdForTenant({
      tenantId: input.context.tenantId,
      invoiceId: input.invoiceId,
    });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    if (invoice.status !== "DRAFT" && invoice.status !== "SYNC_FAILED") {
      throw new ValidationError(
        `Invoice cannot be approved from status ${invoice.status}`,
      );
    }

    const approvedInvoice = await this.invoiceRepository.updateStatus({
      tenantId: input.context.tenantId,
      invoiceId: input.invoiceId,
      status: "APPROVED",
    });

    await this.auditLogRepository.create({
      tenantId: input.context.tenantId,
      actorUserId: input.context.userId,
      entityType: "invoice",
      entityId: input.invoiceId,
      action: "invoice.approved",
      metadata: {
        previousStatus: invoice.status,
        newStatus: "APPROVED",
      },
    });

    const outboxEvent = await this.outboxRepository.create({
      tenantId: input.context.tenantId,
      eventType: "invoice.approved",
      payload: {
        invoiceId: input.invoiceId,
      },
    });

    await this.invoiceRepository.updateStatus({
      tenantId: input.context.tenantId,
      invoiceId: input.invoiceId,
      status: "SYNCING",
    });

    const idempotencyKey = `fake-erp:${input.context.tenantId}:${input.invoiceId}`;

    try {
      const syncResult = await this.erpClient.syncInvoice(approvedInvoice);

      await this.integrationSyncRepository.create({
        tenantId: input.context.tenantId,
        invoiceId: input.invoiceId,
        externalSystem: "fake-erp",
        status: "SUCCESS",
        requestPayload: {
          invoiceId: approvedInvoice.id,
          invoiceNumber: approvedInvoice.invoiceNumber,
          supplierName: approvedInvoice.supplierName,
          grossAmount: approvedInvoice.grossAmount,
          currency: approvedInvoice.currency,
        },
        responsePayload: syncResult,
        idempotencyKey,
      });

      await this.invoiceRepository.updateStatus({
        tenantId: input.context.tenantId,
        invoiceId: input.invoiceId,
        status: "SYNCED",
      });

      await this.outboxRepository.markProcessed({
        eventId: outboxEvent.id,
      });

      return this.invoiceRepository.findByIdForTenant({
        tenantId: input.context.tenantId,
        invoiceId: input.invoiceId,
      });
    } catch (error) {
      await this.integrationSyncRepository.create({
        tenantId: input.context.tenantId,
        invoiceId: input.invoiceId,
        externalSystem: "fake-erp",
        status: "FAILED",
        requestPayload: {
          invoiceId: approvedInvoice.id,
          invoiceNumber: approvedInvoice.invoiceNumber,
          supplierName: approvedInvoice.supplierName,
          grossAmount: approvedInvoice.grossAmount,
          currency: approvedInvoice.currency,
        },
        errorMessage:
          error instanceof Error ? error.message : "Unknown ERP sync error",
        idempotencyKey,
      });

      await this.invoiceRepository.updateStatus({
        tenantId: input.context.tenantId,
        invoiceId: input.invoiceId,
        status: "SYNC_FAILED",
      });

      await this.outboxRepository.markFailed({
        eventId: outboxEvent.id,
      });

      return this.invoiceRepository.findByIdForTenant({
        tenantId: input.context.tenantId,
        invoiceId: input.invoiceId,
      });
    }
  }
}
