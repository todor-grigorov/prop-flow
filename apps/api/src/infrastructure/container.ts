import { DevLoginUseCase } from "../application/use-cases/auth/devLogin.useCase.js";
import { JwtTokenService } from "./auth/jwtTokenService.js";
import { prisma } from "./persistence/prisma/prismaClient.js";
import { MembershipRepository } from "./persistence/repositories/membershipRepository.js";
import { UserRepository } from "./persistence/repositories/userRepository.js";

const userRepository = new UserRepository(prisma);
const membershipRepository = new MembershipRepository(prisma);
const tokenService = new JwtTokenService();

export const container = {
  tokenService,

  devLoginUseCase: new DevLoginUseCase(
    userRepository,
    membershipRepository,
    tokenService,
  ),
};
