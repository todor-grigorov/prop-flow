import { RequestContext } from "../../dto/requestContext.js";
import { IDocumentRepository } from "../../ports/IDocumentRepository.js";
import { ForbiddenError } from "../../../domain/errors/applicationError.js";
import { can } from "../../services/permissionService.js";

export class ListDocumentsUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(input: { context: RequestContext }) {
    if (!can(input.context.role, "document:read")) {
      throw new ForbiddenError("Missing permission: document:read");
    }

    return this.documentRepository.listForTenant({
      tenantId: input.context.tenantId,
    });
  }
}
