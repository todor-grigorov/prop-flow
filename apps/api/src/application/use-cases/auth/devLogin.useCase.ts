import { IMembershipRepository } from "../../ports/IMembershipRepository.js";
import { TokenService } from "../../ports/tokenService.js";
import { IUserRepository } from "../../ports/IUserRepository.js";
import {
  NotFoundError,
  ValidationError,
} from "../../../domain/errors/applicationError.js";

export class DevLoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: { email: string; tenantId?: string }): Promise<{
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string | null;
    };
    tenant: {
      id: string;
    };
    role: string;
  }> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const membership = input.tenantId
      ? await this.membershipRepository.findByUserAndTenant({
          userId: user.id,
          tenantId: input.tenantId,
        })
      : await this.membershipRepository.findFirstByUserId(user.id);

    if (!membership) {
      throw new ValidationError("User is not a member of the requested tenant");
    }

    const accessToken = await this.tokenService.signAccessToken({
      sub: user.id,
      tenantId: membership.tenantId,
      role: membership.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tenant: {
        id: membership.tenantId,
      },
      role: membership.role,
    };
  }
}
