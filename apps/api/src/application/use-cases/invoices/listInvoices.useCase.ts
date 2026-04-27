import { RequestContext } from "../../dto/requestContext.js";
import { IInvoiceRepository } from "../../ports/IInvoiceRepository.js";
import { ForbiddenError } from "../../../domain/errors/applicationError.js";
import { can } from "../../services/permissionService.js";

export class ListInvoicesUseCase {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async execute(input: { context: RequestContext }) {
    if (!can(input.context.role, "invoice:read")) {
      throw new ForbiddenError("Missing permission: invoice:read");
    }

    return this.invoiceRepository.listForTenant({
      tenantId: input.context.tenantId,
    });
  }
}
