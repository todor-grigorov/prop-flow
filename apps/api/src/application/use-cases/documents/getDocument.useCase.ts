import { RequestContext } from "../../dto/requestContext.js";
import { IDocumentRepository } from "../../ports/IDocumentRepository.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../../../domain/errors/applicationError.js";
import { can } from "../../services/permissionService.js";

export class GetDocumentUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(input: { context: RequestContext; documentId: string }) {
    if (!can(input.context.role, "document:read")) {
      throw new ForbiddenError("Missing permission: document:read");
    }

    const document = await this.documentRepository.findByIdForTenant({
      tenantId: input.context.tenantId,
      documentId: input.documentId,
    });

    if (!document) {
      throw new NotFoundError("Document not found");
    }

    return document;
  }
}
