import { DevLoginUseCase } from "../application/use-cases/auth/devLogin.useCase.js";
import { JwtTokenService } from "./auth/jwtTokenService.js";
import { prisma } from "./persistence/prisma/prismaClient.js";
import { PrismaMembershipRepository } from "./persistence/repositories/prismaMembershipRepository.js";
import { PrismaUserRepository } from "./persistence/repositories/prismaUserRepository.js";

const userRepository = new PrismaUserRepository(prisma);
const membershipRepository = new PrismaMembershipRepository(prisma);
const tokenService = new JwtTokenService();

export const container = {
  tokenService,

  devLoginUseCase: new DevLoginUseCase(
    userRepository,
    membershipRepository,
    tokenService,
  ),
};
