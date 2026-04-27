import { RequestContext } from "../../dto/requestContext.js";
import { IIntegrationSyncRepository } from "../../ports/IIntegrationSyncRepository.js";
import { ForbiddenError } from "../../../domain/errors/applicationError.js";
import { can } from "../../services/permissionService.js";

export class ListIntegrationSyncEventsUseCase {
  constructor(
    private readonly integrationSyncRepository: IIntegrationSyncRepository,
  ) {}

  async execute(input: { context: RequestContext }) {
    if (!can(input.context.role, "integration:read")) {
      throw new ForbiddenError("Missing permission: integration:read");
    }

    return this.integrationSyncRepository.listForTenant({
      tenantId: input.context.tenantId,
    });
  }
}
