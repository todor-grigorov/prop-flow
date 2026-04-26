import { UserRepository } from "../../../application/ports/userRepository.js";
import { User } from "../../../domain/entities/user.js";
import { PrismaClient } from "../../../generated/prisma/client.js";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
