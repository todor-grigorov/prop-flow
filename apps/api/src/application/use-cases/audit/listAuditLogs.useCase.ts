import { RequestContext } from "../../dto/requestContext.js";
import { IAuditLogRepository } from "../../ports/IAuditLogRepository.js";
import { ForbiddenError } from "../../../domain/errors/applicationError.js";
import { can } from "../../services/permissionService.js";

export class ListAuditLogsUseCase {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {}

  async execute(input: { context: RequestContext }) {
    if (!can(input.context.role, "auditLog:read")) {
      throw new ForbiddenError("Missing permission: auditLog:read");
    }

    return this.auditLogRepository.listForTenant({
      tenantId: input.context.tenantId,
    });
  }
}
