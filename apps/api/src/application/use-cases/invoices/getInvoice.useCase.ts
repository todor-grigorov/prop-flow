import { RequestContext } from "../../dto/requestContext.js";
import { IInvoiceRepository } from "../../ports/IInvoiceRepository.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../../../domain/errors/applicationError.js";
import { can } from "../../services/permissionService.js";

export class GetInvoiceUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(input: { context: RequestContext; invoiceId: string }) {
    if (!can(input.context.role, "invoice:read")) {
      throw new ForbiddenError("Missing permission: invoice:read");
    }

    const invoice = await this.invoiceRepository.findByIdForTenant({
      tenantId: input.context.tenantId,
      invoiceId: input.invoiceId,
    });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    return invoice;
  }
}
