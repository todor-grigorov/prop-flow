import { RequestContext } from "../../dto/requestContext.js";
import { IAuditLogRepository } from "../../ports/IAuditLogRepository.js";
import { IInvoiceRepository } from "../../ports/IInvoiceRepository.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../../../domain/errors/applicationError.js";
import { can } from "../../services/permissionService.js";

export class RejectInvoiceUseCase {
  constructor(
    private readonly invoiceRepository: IInvoiceRepository,
    private readonly auditLogRepository: IAuditLogRepository,
  ) {}

  async execute(input: {
    context: RequestContext;
    invoiceId: string;
    reason?: string;
  }) {
    if (!can(input.context.role, "invoice:reject")) {
      throw new ForbiddenError("Missing permission: invoice:reject");
    }

    const invoice = await this.invoiceRepository.findByIdForTenant({
      tenantId: input.context.tenantId,
      invoiceId: input.invoiceId,
    });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    if (invoice.status !== "DRAFT") {
      throw new ValidationError(
        `Invoice cannot be rejected from status ${invoice.status}`,
      );
    }

    const rejectedInvoice = await this.invoiceRepository.updateStatus({
      tenantId: input.context.tenantId,
      invoiceId: input.invoiceId,
      status: "REJECTED",
    });

    await this.auditLogRepository.create({
      tenantId: input.context.tenantId,
      actorUserId: input.context.userId,
      entityType: "invoice",
      entityId: input.invoiceId,
      action: "invoice.rejected",
      metadata: {
        previousStatus: invoice.status,
        newStatus: "REJECTED",
        reason: input.reason ?? null,
      },
    });

    return rejectedInvoice;
  }
}
